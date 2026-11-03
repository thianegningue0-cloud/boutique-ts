import './style.css'
type Product = {
  id: number
  name: string
  price: number
  category: string
  image?: string
}

type CartItem = {
  product: Product
  qty: number
}

const products: Product[] = [
  { id: 1, name: "Casque Bluetooth", price: 32000, category: "tech" },
  { id: 2, name: "Mug Isotherme", price: 9800, category: "maison" },
  { id: 3, name: "T-Shirt Blanc", price: 3000, category: "mode" },
  { id: 4, name: "Clavier Mécanique", price: 52000, category: "tech" },
  { id: 5, name: "Lampe de bureau", price: 23000, category: "maison" },
]

let cart: CartItem[] = []
let searchText: string = ""
let selectedCategory: string = ""

const catalogueEl = document.querySelector<HTMLDivElement>("#catalogue")!
const searchEl = document.querySelector<HTMLInputElement>("#search")!
const categoryEl = document.querySelector<HTMLSelectElement>("#category")!
const cartCountEl = document.querySelector<HTMLDivElement>("#cart-count")!
const cartItemsEl = document.querySelector<HTMLDivElement>("#panier-items")!
const totalEl = document.querySelector<HTMLParagraphElement>("#panier-total")!

// Filtre + recherche : map, filter créent des copies, on ne modifie pas products
function getFilteredProducts(): Product[] {
  return products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase())
    const matchCat = selectedCategory ? p.category === selectedCategory : true
    return matchSearch && matchCat
  })
}

function renderCatalogue(): void {
  const list = getFilteredProducts()
  catalogueEl.innerHTML = list.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p>${p.category} - ${p.price}FCFA</p>
      <button data-id="${p.id}">Ajouter</button>
    </div>
  `).join("")

  // querySelector + Number(champ.value) et vérif null avec ?
  catalogueEl.querySelectorAll<HTMLButtonElement>("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id) 
      const product = products.find(p => p.id === id)
      if (product) addToCart(product) // vérif null
    })
  })
}

function addToCart(product: Product): void {
  // On ne modifie pas le tableau, on crée une copie avec ...
  const existing = cart.find(c => c.product.id === product.id)
  if (existing) {
    cart = cart.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c)
  } else {
    cart = [...cart, { product, qty: 1 }]
  }
  renderCart()
}

function renderCart(): void {
  cartItemsEl.innerHTML = cart.map(item => `
    <div>${item.product.name} x ${item.qty} = ${item.product.price * item.qty}FCFA</div>
  `).join("") || "Panier vide"

  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  totalEl.textContent = `Total: ${total}FCFA`
  cartCountEl.textContent = `Panier: ${count} - ${total}FCFA`
}

// Events avec type
searchEl.addEventListener("input", () => {
  searchText = searchEl.value // value est toujours du texte
  renderCatalogue()
})

categoryEl.addEventListener("change", () => {
  selectedCategory = categoryEl.value
  renderCatalogue()
})

renderCatalogue()
renderCart()