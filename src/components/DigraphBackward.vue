<template>
	<v-card class="elevation-12">
		<v-toolbar color="primary" dark flat>
			<v-toolbar-title>Nodes + Backward List</v-toolbar-title>
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
					label="Nodes"
					name="nodes"
					type="text"
					outlined
				></v-text-field>
				<v-text-field
					v-model="edgesInput"
					label="Adjacency List"
					name="edges"
					type="text"
					outlined
				></v-text-field>
			</v-form>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Edges</v-label>
				</v-col>
				<v-col>{{ print_l(edges) }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Incidence List</v-label>
				</v-col>
				<v-col>{{ incidenceList }}</v-col>
			</v-row>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Target Adjacency List</v-label>
				</v-col>
				<v-col>{{ targetAdjacencyList }}</v-col>
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
			<v-btn color="primary" @click="calculate()">Calculate</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import { difference, isEqual, union } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { INode } from '../models/node.model'

@Component
export default class DigraphBackward extends Vue {
	private nodesInput = ''
	private edgesInput = ''

	private graph: Array<INode> = []

	constructor() {
		super()
	}

	get nodes(): Array<number> {
		return this.nodesInput
			.trim()
			.slice(1, this.nodesInput.length - 1)
			.split(',')
			.map(x => Number(x))
	}

	get edges(): Array<Array<number>> {
		const output: Array<Array<number>> = []
		const parse = this.edgesInput
			.trim()
			.slice(2, this.edgesInput.length - 2)
			.split('],[')
			.map(y =>
				y.split(',{').map(z =>
					z
						.replace('}', '')
						.split(',')
						.map(k => Number(k))
				)
			)

		for (let index = 0; index < parse.length; index++) {
			const el = parse[index]
			if (el[0][0] > 0) {
				el[1].forEach(x => {
					output.push([x, index + 1])
				})
			}
		}

		return output
	}

	get incidenceList(): string {
		function _formatArray(obj: Array<any>) {
			if (obj.length === 0) return '[]'

			let retVal = '['
			obj.forEach(x => (retVal += `${x},`))
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
			output += this.print_r(node.next)
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

	private print_r(array: Array<any>, list: boolean = false) {
		if (array.length === 0) return '{}'

		let output = ''

		function _formatArray(obj: Array<any>) {
			if (obj.length === 0) return '{}'

			let retVal = '{'
			obj.forEach(x => (retVal += `${x},`))
			retVal = retVal.slice(0, retVal.length - 1)
			retVal += '}'

			return retVal
		}

		if (list) {
			output += '['
			array.forEach(x => (output += `${_formatArray(x)},`))
			if (output.charAt(output.length - 1) !== '[')
				output = output.slice(0, output.length - 1)
			output += ']'
		} else {
			output = _formatArray(array)
		}

		return output
	}

	private print_l(array: Array<any>) {
		if (array.length === 0) return '{}'

		let output = ''

		function _formatArray(obj: Array<any>) {
			if (obj.length === 0) return '{}'

			let retVal = '['
			obj.forEach(x => (retVal += `${x},`))
			retVal = retVal.slice(0, retVal.length - 1)
			retVal += ']'

			return retVal
		}

		output += '{'
		array.forEach(x => (output += `${_formatArray(x)},`))
		if (output.charAt(output.length - 1) !== '{')
			output = output.slice(0, output.length - 1)
		output += '}'

		return output
	}
}
</script>

<style scoped></style>
