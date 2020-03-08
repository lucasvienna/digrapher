<template>
	<v-app>
		<v-app-bar app color="primary">
			<v-toolbar-title class="headline text-uppercase">
				<span style="color: #fff;">Digrapher</span>
			</v-toolbar-title>
			<v-spacer />
			<v-btn
				text
				href="http://github.com/Avyiel/digrapher"
				target="_blank"
				color="white"
			>
				GitHub <v-icon small color="white">mdi-open-in-new</v-icon>
			</v-btn>
		</v-app-bar>

		<v-content>
			<v-container class="fill-height" fluid>
				<v-row align="start" justify="center">
					<v-col cols="12" sm="8" md="4">
						<Digraph />
					</v-col>
					<v-col cols="12" sm="8" md="4">
						<DigraphForward />
					</v-col>
					<v-col cols="12" sm="8" md="4">
						<DigraphBackward />
					</v-col>
					<v-col cols="12" sm="8" md="4">
						<DigraphPartialNodes />
					</v-col>
					<v-col cols="12" sm="8" md="4">
						<DigraphPartialEdges />
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Digraph from './components/Digraph.vue'
import DigraphForward from './components/DigraphForward.vue'
import DigraphBackward from './components/DigraphBackward.vue'
import DigraphPartialNodes from './components/DigraphPartialNodes.vue'
import DigraphPartialEdges from './components/DigraphPartialEdges.vue'

export default Vue.extend({
	name: 'App',
	components: {
		Digraph,
		DigraphForward,
		DigraphBackward,
		DigraphPartialNodes,
		DigraphPartialEdges
	}
})
</script>
