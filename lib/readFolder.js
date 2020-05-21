const dados = [{
	"id": 1,
	"firstName": "Ana",
	"lastName": "Lucia",
	"phone": "(11)99989-8989",
	"mobilePhone": "(11)99989-8989",
	"email": "aninha@gmail.com",
	"gender": {
		"name": "feminino"
	},
	"status": {
		"name": "inativo"
	},
	"services": [{
		"name": "progressiva"
	},
		{
			"name": "Manicure"
		}
	]
}];

const config = {
	perfil: (object) => ['nome', 'sobrenome', 'email', 'phone'].reduce((obj, key) => {
		obj.key = object[key];
		return obj;
	}, {}),
	servicos: (object) => object.services.map(({
												   name
											   }) => name)
};

new Vue({
	el: '#app',
	vuetify: new Vuetify(),
	data() {
		return {
			tab: null,
			employee: [],
			dados: null,
			tabs: [{
				name: 'Serviços',
				key: 'servicos'
			}, {
				name: 'Perfil',
				key: 'perfil'
			}],
		}
	},
	created() {
		// para simular o axios:
		setTimeout(() => this.dados = dados, 2000);
	},
	computed: {
		tabsContent() {
			if (!this.dados) return [];
			return this.tabs.map(({
									  name,
									  key
								  }) => config[key](this.dados));

		}

	});
