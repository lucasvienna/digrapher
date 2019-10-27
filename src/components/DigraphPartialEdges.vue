<template>
	<v-card class="elevation-12">
		<v-toolbar color="primary" dark flat>
			<v-toolbar-title>Nodes + Edges + Partial Edges</v-toolbar-title>
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
					label="Edges"
					name="edges"
					type="text"
					outlined
				></v-text-field>
				<v-text-field
					v-model="partialsInput"
					label="Partial Edges"
					name="partial-edges"
					type="text"
					outlined
				></v-text-field>
			</v-form>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Partial Nodes</v-label>
				</v-col>
				<v-col>{{ print_r(partialNodes) }}</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { difference, isEqual, union } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { INode } from '../models/node.model'

@Component
export default class DigraphPartialEdges extends Vue {
	private nodesInput = ''
	private edgesInput = ''
	private partialsInput = ''

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

	get partialEdges(): Array<Array<number>> {
		return this.edgesInput
			.trim()
			.slice(2, this.edgesInput.length - 2)
			.split('],[')
			.map(x => x.split(',').map(k => Number(k)))
	}

	get partialNodes(): Array<number> {
		const output: Array<number> = []

		this.partialEdges.forEach(edge => {
			if (output.indexOf(edge[0]) === -1) {
				output.push(edge[0])
			}
			if (output.indexOf(edge[1]) === -1) {
				output.push(edge[1])
			}
		})

		return output
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
}
</script>

<style scoped></style>
