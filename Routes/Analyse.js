const express = require("express");
const Analyse = require("../Models/Analyse");
const { isAuth } = require("../Middlewares/isAuth");
const analyseRouter = express.Router();


analyseRouter.post('/addAnalyse',  async(req, res)=>{
    try {

        
        
        const newAnalyse = new Analyse(req.body)

        await newAnalyse.save()

        res.status(200).send({msg : 'Contact added',newAnalyse})

    } catch (error) {
        res.status(500).send('Could not add Analyse')
    }
})


analyseRouter.get('/getAllAnalyse', async(req, res)=>{
    try {

        const analyses = await Analyse.find().populate("patient").populate("biologiste")

        res.status(200).send({msg : 'Analyses list', analyses})

    } catch (error) {
        res.status(500).send('Could not get Analyses')
    }
})

analyseRouter.get('/getAllAnalyseBio',isAuth, async(req, res)=>{
    try {
        

        const analyses = await Analyse.find({biologiste : req.user._id}).populate("patient").populate("biologiste")

        res.status(200).send({msg : 'Analyses list', analyses})

    } catch (error) {
        res.status(500).send('Could not get Analyses')
    }
})


analyseRouter.get('/getAllAnalysePatient',isAuth, async(req, res)=>{
    try {
        

        const analyses = await Analyse.find({patient : req.user._id}).populate("patient").populate("biologiste")

        res.status(200).send({msg : 'Analyses list', analyses})

    } catch (error) {
        res.status(500).send('Could not get Analyses')
    }
})






module.exports = analyseRouter;
