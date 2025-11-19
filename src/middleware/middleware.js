import express from "express";

const setUpMiddleware = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
};

export default setUpMiddleware