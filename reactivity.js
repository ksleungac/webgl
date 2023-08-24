let target = null;
let data = { price: 10, quantity: 2 };
let total, salePrice;
class Dep {
  constructor() {
    this.subscribers = [];
  }
  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
  notify() {
    this.subscribers.forEach((sub) => sub());
  }
}

let deps = new Map();
Object.keys(data).forEach((key) => {
  deps.set(key, new Dep());
});

let data_without_proxy = data;

data = new Proxy(data_without_proxy, {
  get(obj, key) {
    deps.get(key).depend();
    return obj[key];
  },
  set(obj, key, newVal) {
    obj[key] = newVal;
    deps.get(key).notify();
    return true;
  },
});

function watcher(myFunc) {
  target = myFunc;
  target();
  target = null;
}

watcher(() => {
  total = data.price * data.quantity;
});

deps.set("discount", new Dep());
data["discount"] = 5;

watcher(() => {
  salePrice = data.price - data.discount;
});
