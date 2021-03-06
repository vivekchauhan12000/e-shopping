import { observable, decorate, action, computed } from 'mobx';

class GlobalStore {
    // User
    user = {
        username: '',
        email: '',
        thumbnail: '',
        _id: '',
    };
    updateUser = (updated) => this.user = updated;
    updateAddress = (address) => this.user.address = Object.assign({}, address);

    // Pets 'Aquarium', 'Bird', 'Fluffy', 'Reptile'
    aquarium = [];
    bird = [];
    fluffy = [];
    reptile = [];
    initAquarium = list => this.aquarium = list;
    initBird = list => this.bird = list;
    initFluffy = list => this.fluffy = list;
    initReptile = list => this.reptile = list;
    updateAquariumCount = (update, petID) => {
        const idx = this.aquarium.findIndex(pet => pet._id === petID);
        this.aquarium[idx].count -= update
    }; 
    updateBirdCount = (update, petID) => {
        const idx = this.bird.findIndex(pet => pet._id === petID);
        this.bird[idx].count -= update
    };
    updateFluffyCount = (update, petID) => {
        const idx = this.fluffy.findIndex(pet => pet._id === petID);
        this.fluffy[idx].count -= update
    };
    updateReptileCount = (update, petID) => {
        const idx = this.reptile.findIndex(pet => pet._id === petID);
        this.reptile[idx].count -= update
    }; 


    // Carts
    cart = {};
    pets = [];
    initCart = (cart) => this.cart = Object.assign({}, cart);
    initPets = pets => this.pets = pets;
    addPet = (pet) => this.pets.push({pet: pet, quantity: 1, _id: pet._id});
    removePet = petID => this.pets = this.pets.filter(pet => pet._id !== petID);
    updatePetQuantity = (petID, value) => {
        const idx = this.pets.findIndex(item => item._id === petID);
        this.pets[idx].quantity = value;
    };
    get subTotal() {
        let total = 0;
        for (let i = 0; i < this.pets.length; i++) {
            total += this.pets[i].quantity * this.pets[i].pet.price;
        }
        return total;
    };

    //Pending order: pending cart  ---> 1 to 1 relation
    order = {
        _id: '',
        total: 0,
    };
    updateOrderID = (id) => this.order._id = id;
    updateTotal = (total) => this.order.total = total;

    orders = [];
    initOrder = (list) => this.orders = list;
    addOrder = (order) => this.orders.unshift(order);
   

    // Carousel visible
    petsCarousleVisible = false;
    togglepetsCarousleVisibility = () => this.petsCarousleVisible = !this.petsCarousleVisible;
}

decorate(
    GlobalStore,
    {
        // User
        user: observable,
        updateUser: action,

        // Pets
        aquarium: observable,
        bird: observable,
        fluffy: observable,
        reptile: observable,
        initAquarium: action,
        initBird: action,
        initFluffy: action,
        initReptile: action,
        updateAquariumCount: action,
        updateBirdCount: action,
        updateFluffyCount: action,
        updateReptileCount: action,

        // Cart
        cart: observable,
        pets: observable,
        initPets: action,
        initCart: action,
        addPet: action,
        removePet: action,
        updatePetQuantity: action,
        subTotal: computed,

        // Pending Order
        order: observable,
        orders: observable,
        initOrder: action,
        addOrder: action,
        updateOrderID: action,
        updateTotal: action,

        // Carousel
        petsCarousleVisible: observable,
        togglepetsCarousleVisibility: action,
    }
);

export default new GlobalStore();