const app = Vue.createApp({
    data() {
        return {
            productos: [],
            productosBackUp: [],
            juguetes: [],
            juguetesBackUp: [],
            medicamentos: [],
            medicamentosBackUp: [],
            checksMas: [],
            checksMenos: [],
            textoIngresado: "",
            carrito: [],
            total: 0,
        }
    },
    created() {
        fetch('https://apipetshop.herokuapp.com/api/articulos')
            .then(res => res.json())
            .then(data => {
                this.productos = data.response
                this.agregarCantidad(this.productos)
                this.productosBackUp = this.productos
                this.medicamentos = this.productos.filter(prod => prod.tipo == "Medicamento")
                this.medicamentosBackUp = this.medicamentos
                this.juguetes = this.productos.filter(prod => prod.tipo == "Juguete")
                this.juguetesBackUp = this.juguetes
            })
            .catch(err => console.log(err))
    },
    mounted() {
        let local = JSON.parse(localStorage.getItem('cart'))
        if (!local) {
            this.carrito = []
        } else {
            this.carrito = local
        }
        let totalGuardado = JSON.parse(localStorage.getItem('total'))
        this.total = totalGuardado
    },
    methods: {
        agregarCantidad(array) {
            array = array.map(elemento => elemento['cantidad'] = 0)
        },

        agregarCarrito(elemento) {
            let e = this.carrito.filter(es => es._id == elemento._id)
            console.log(e);

            if (e.length > 0) {
                // CASO EN EL QUE ESTA EL ELEMENTO YA EN EL CARRITO
                this.carrito.forEach(el => {
                    if (el._id == elemento._id) {
                        if (el.stock > 0) {
                            el.cantidad++
                            el.stock--
                        }
                    }
                })
                this.actualizarCarrito()
            } else {
                // CASO EN EL QUE NO ESTA
                this.productos = this.productosBackUp.forEach(el => {
                    if (el._id == elemento._id) {
                        el.cantidad++
                        el.stock--
                    }
                })
                this.carrito.push(elemento)
                this.actualizarCarrito()
            }
            localStorage.setItem('total', JSON.stringify(this.total))
        },
        eliminarCarrito(elemento) {
            this.carrito = this.carrito.filter(element => element != elemento)
            this.actualizarCarrito()
            localStorage.setItem('total', JSON.stringify(this.total))
        },
        eliminarUnidad(elemento) {
            if (elemento.cantidad > 0) {
                this.carrito.forEach(el => {
                    if (el._id == elemento._id) {
                        el.cantidad--
                        el.stock++
                    }
                })
            }
            this.actualizarCarrito()
        },
        totalCompra() {
            this.total = 0
            this.carrito.map(e => {
                let suma = e.cantidad * e.precio
                this.total += suma
            })
        },

        eliminarTodo(){
            localStorage.clear()
        },

        actualizarCarrito(){
            localStorage.setItem('cart', JSON.stringify(this.carrito))
            this.totalCompra()
        }
    },
    computed: {
        filtroChecksM() {
            let primerFiltro = this.medicamentosBackUp.filter(med => med.nombre.toLowerCase().includes(this.textoIngresado.toLowerCase()))
            if (this.checksMas.length || this.checksMenos.length) {
                this.medicamentos = primerFiltro.filter(med => med.precio <= parseInt(this.checksMenos) || med.precio >= parseInt(this.checksMas))
            }
            else {
                this.medicamentos = primerFiltro
            }
        },
        filtroChecksJ() {
            let primerFiltro = this.juguetesBackUp.filter(med => med.nombre.toLowerCase().includes(this.textoIngresado.toLowerCase()))
            if (this.checksMas.length || this.checksMenos.length) {
                this.juguetes = primerFiltro.filter(med => med.precio <= parseInt(this.checksMenos) || med.precio >= parseInt(this.checksMas))
            }
            else {
                this.juguetes = primerFiltro
            }
        },
        contact() {
            alert("¡Gracias por enviarnos tu mensaje! Responderemos lo más rápido posible")
        },
    }
}).mount('#app')