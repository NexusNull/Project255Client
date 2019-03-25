

module.exports = {
  "0": {
    "name": "generator",
    "articles": "a",
    "maxHealth": 500,
    "powerPerTick": 0,
    "powerStore": 8000,
    "inventorySize": 0,
    "recipes": {
      "0": {
        "time": 5,
        "power": 1000,
        "input": [
          {
            "name": "coal",
            "amount": 1
          }
        ],
        "output": []
      }
    }
  },
  "1": {
    "name": "furnace",
    "articles": "a",
    "maxHealth": 500,
    "powerPerTick": -2,
    "powerStore": 8000,
    "inventorySize": 0,
    "recipes": {
      "0": {
        "time": 10,
        "power": -100,
        "input": [
          {
            "name": "ironOre",
            "amount": 1
          }
        ],
        "output": []
      }
    }
  }
};
