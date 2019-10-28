<template>
	<v-card class="elevation-12">
		<v-toolbar color="primary" dark flat>
			<v-toolbar-title>Partial Nodes + Edges</v-toolbar-title>
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
					v-model="partialsInput"
					label="Partial Nodes"
					name="partial-nodes"
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
			</v-form>

			<v-row dense>
				<v-col class="text-right" cols="4">
					<v-label>Partial Edges</v-label>
				</v-col>
				<v-col>{{ print_l(partialEdges) }}</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { difference, isEqual, union } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { INode } from '../models/node.model'

@Component
export default class DigraphPartialNodes extends Vue {
	private edgesInput = ''
	private partialsInput = ''

	get partialNodes(): Array<number> {
		return this.partialsInput
			.trim()
			.slice(1, this.partialsInput.length - 1)
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
		const output: Array<Array<number>> = []

		this.edges.forEach(edge => {
			if (
				this.partialNodes.indexOf(edge[0]) !== -1 &&
				this.partialNodes.indexOf(edge[1]) !== -1
			) {
				output.push(edge)
			}
		})

		return output
	}

	private onReset() {
		this.edgesInput = ''
		this.partialsInput = ''
	}
}
</script>

<style scoped></style>
