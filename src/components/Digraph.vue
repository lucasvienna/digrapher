<template>
	<v-card class="elevation-12">
		<v-toolbar color="primary" dark flat>
			<v-toolbar-title>Knoten + Pfeile</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn icon large v-on="on" @click="onReset()">
						<v-icon>mdi-restore</v-icon>
					</v-btn>
				</template>
				<span>Reset</span>
			</v-tooltip>
		</v-toolbar>
		<v-card-text>
			<v-form>
				<v-text-field
					v-model="nodesInput"
					label="Knoten"
					name="nodes"
					type="text"
					outlined
				></v-text-field>
				<v-text-field
					v-model="edgesInput"
					label="Pfeile"
					name="edges"
					type="text"
					outlined
				></v-text-field>
			</v-form>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Schlinge</v-label>
				</v-col>
				<v-col>{{ loops }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Parallele Pfeile</v-label>
				</v-col>
				<v-col>{{ parallels }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Ausgangsgrade</v-label>
				</v-col>
				<v-col>{{ outgoingDegrees }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Eingangsgrade</v-label>
				</v-col>
				<v-col>{{ inboundDegrees }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Quellen</v-label>
				</v-col>
				<v-col>{{ print_r(sources) }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Senken</v-label>
				</v-col>
				<v-col>{{ print_r(targets) }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Isolierte Knoten</v-label>
				</v-col>
				<v-col>{{ print_r(isolated) }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Mengenliste der Nachfolger</v-label>
				</v-col>
				<v-col>{{ print_r(sourceTargets, true) }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Mengenliste der Vorgänger</v-label>
				</v-col>
				<v-col>{{ print_r(targetSources, true) }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Inzidenzliste</v-label>
				</v-col>
				<v-col>{{ incidenceList }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Adjazenzliste der Endknoten</v-label>
				</v-col>
				<v-col>{{ targetAdjacencyList }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Adjazenzliste der Startknoten</v-label>
				</v-col>
				<v-col>{{ sourceAdjacencyList }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Forward Star EK</v-label>
				</v-col>
				<v-col>{{ ek }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Forward Start EKI</v-label>
				</v-col>
				<v-col>{{ eki }}</v-col>
			</v-row>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="calculate()">Berechnen</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import { isEqual, intersection } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { INode } from '../models/node.model'
import { print_r } from '../utils/print'

@Component
export default class Digraph extends Vue {
	private nodesInput = ''
	private edgesInput = ''

	private graph: Array<INode> = []

	get nodes(): Array<number> {
		return this.nodesInput
			.trim()
			.slice(1, this.nodesInput.length - 1)
			.split(',')
			.map(x => Number(x))
	}

	get edges(): Array<Array<number>> {
		return this.edgesInput
			.trim()
			.slice(2, this.edgesInput.length - 2)
			.split('],[')
			.map(x => x.split(',').map(k => Number(k)))
	}

	get properties(): Array<string> {
		const props = []

		if (this.hasLoops()) props.push('loop')
		if (this.hasParallels()) props.push('parallel')

		return props
	}

	get loops(): Array<Array<number>> {
		const loops: Array<Array<number>> = []
		this.edges.forEach(vertice => {
			if (vertice[0] === vertice[1]) loops.push(vertice)
		})
		return loops
	}

	get parallels(): Array<Array<number>> {
		const findDuplicates = (arr: Array<any>) =>
			arr.filter((item, index) => arr.indexOf(item) != index)

		return findDuplicates(this.edges.map(el => el.toString())).map(dupe =>
			dupe.split(',').map((x: string) => Number(x))
		)
	}

	get outgoingDegrees(): Array<number> {
		const outDgr: Array<number> = []
		this.graph.forEach(node => outDgr.push(node.degreeOut))
		return outDgr
	}

	get inboundDegrees(): Array<number> {
		const inDgr: Array<number> = []
		this.graph.forEach(node => inDgr.push(node.degreeIn))
		return inDgr
	}

	get sources(): Array<number> {
		const sources: Array<number> = []
		for (let index = 0; index < this.graph.length; index++) {
			if (this.graph[index].degreeIn === 0) sources.push(index + 1)
		}
		return sources
	}

	get targets(): Array<number> {
		const targets: Array<number> = []
		for (let index = 0; index < this.graph.length; index++) {
			if (this.graph[index].degreeOut === 0) targets.push(index + 1)
		}
		return targets
	}

	get isolated(): Array<number> {
		return intersection(this.sources, this.targets)
	}

	get sourceTargets(): Array<Array<number>> {
		const sourceTargets: Array<Array<number>> = []

		this.graph.forEach(node => {
			sourceTargets.push(node.next)
		})

		return sourceTargets
	}

	get targetSources(): Array<Array<number>> {
		const targetSources: Array<Array<number>> = []

		this.graph.forEach(node => {
			targetSources.push(node.prev)
		})

		return targetSources
	}

	get incidenceList(): string {
		function _formatArray(obj: Array<any>) {
			if (obj.length === 0) return '[]'

			let retVal = '['
			obj.forEach(x => (retVal += `${x},`))
			if (retVal.charAt(retVal.length - 1) !== '[')
				retVal = retVal.slice(0, retVal.length - 1)
			retVal += ']'

			return retVal
		}

		let output = '['

		this.graph.forEach(node => {
			output += '['
			output += node.degreeOut
			output += ',{'
			const edges: Array<Array<number>> = []
			this.edges.forEach(edge => {
				if (
					edge[0] - 1 == this.graph.indexOf(node) &&
					edges.indexOf(edge) === -1
				) {
					output += _formatArray(edge)
					output += ','
					edges.push(edge)
				}
			})
			if (output.charAt(output.length - 1) !== '{')
				output = output.slice(0, output.length - 1)

			output += '}'
			output += '],'
		})

		if (output.charAt(output.length - 1) !== '[')
			output = output.slice(0, output.length - 1)
		output += ']'
		return output
	}

	get targetAdjacencyList(): string {
		let output = '['

		this.graph.forEach(node => {
			output += '['
			output += node.degreeOut
			output += ','
			output += print_r(node.next)
			output += '],'
		})

		if (output.charAt(output.length - 1) !== '[')
			output = output.slice(0, output.length - 1)
		output += ']'
		return output
	}

	get sourceAdjacencyList(): string {
		let output = '['

		this.graph.forEach(node => {
			output += '['
			output += node.degreeIn
			output += ','
			output += print_r(node.prev)
			output += '],'
		})

		if (output.charAt(output.length - 1) !== '[')
			output = output.slice(0, output.length - 1)

		output += ']'
		return output
	}

	get ek(): Array<number> {
		const output = [1]
		let index = 0
		this.graph.forEach(node => {
			output.push(node.degreeOut + output[index++])
		})

		return output
	}

	get eki(): Array<number> {
		const output: Array<number> = []
		this.graph.forEach(node => {
			node.next.forEach(next => output.push(next))
		})

		return output
	}

	private calculate(): void {
		this.graph = []

		this.nodes.forEach(node =>
			this.graph.push({
				next: [],
				prev: [],
				degreeOut: 0,
				degreeIn: 0
			})
		)

		this.edges.forEach(edge => {
			this.graph[edge[0] - 1].next.push(edge[1])
			this.graph[edge[1] - 1].prev.push(edge[0])
			this.graph[edge[0] - 1].degreeOut += 1
			this.graph[edge[1] - 1].degreeIn += 1
		})
	}

	private onReset() {
		this.nodesInput = ''
		this.edgesInput = ''
		this.graph = []
	}

	private hasLoops(): boolean {
		return this.loops.length > 0
	}

	private hasParallels(): boolean {
		return this.parallels.length > 0
	}
}
</script>

<style scoped></style>
