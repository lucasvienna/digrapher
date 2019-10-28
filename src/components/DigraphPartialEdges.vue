<template>
	<v-card class="elevation-12">
		<v-toolbar color="primary" dark flat>
			<v-toolbar-title>Partial Edges</v-toolbar-title>
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
	private partialsInput = ''

	get partialEdges(): Array<Array<number>> {
		return this.partialsInput
			.trim()
			.slice(2, this.partialsInput.length - 2)
			.split('],[')
			.map(x => x.split(',').map(k => Number(k)))
	}

	get partialNodes(): Array<number> {
		const output = new Set<number>()

		this.partialEdges.forEach(edge => {
			output.add(edge[0])
			output.add(edge[1])
		})

		return Array.from(output)
	}

	private onReset() {
		this.partialsInput = ''
	}
}
</script>

<style scoped></style>
