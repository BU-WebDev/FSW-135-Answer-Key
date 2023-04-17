const express = require('express')
const inventoryRouter = express.Router()
const Inventory = require('../models/inventory.js')

//GET/READ
inventoryRouter.get('/', async (req, res) =>{
    const result = await Inventory.find()
    res.send({"inventory": result})
})

//CREATE/POST
inventoryRouter.post('/', (req, res, next) =>{
    console.log(req.body)
    const inventory = new Inventory(req.body)
    inventory.save()
    res.status(201).json({inventory})
})

//PUT
inventoryRouter.put('/:id', async(req, res) => {
    try {
        const inventoryId = req.params.id
        const result = await Inventory.replaceOne({_id: inventoryId}, req.body)
        console.log(result)
        res.json({updatedCount: result.modifiedCount})
    } catch (e) {
        res.status(500).json({error: 'something went wrong'})
    }
})

//DELETE
inventoryRouter.delete('/:id', async(req, res) => {
    const inventoryId = req.params.id
    const result = await Inventory.deleteOne({_id: inventoryId})
    res.json({deleteCount: result.deletedCount })
})

module.exports = inventoryRouter