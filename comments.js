// Create webserver with express
const express = require('express');
const router = express.Router();    
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user'); 
const { check, validationResult } = require('express-validator');
const { ensureAuthenticated } = require('../config/auth');
const { response } = require('express');

// @route   GET /comments/:id
// @desc    Get all comments for a post
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/index', {post: post});
        }
    });
});

// @route   GET /comments/:id/new
// @desc    Render new comment form
// @access  Private
router.get('/:id/new', ensureAuthenticated, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {post: post});
        }
    });
});

// @route   POST /comments/:id
// @desc    Create new comment
// @access  Private
router.post('/:id', [
    check('content', 'Content is required').not().isEmpty()
], ensureAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('comments/new', {errors: errors.array()});
    } else {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                console.log(err);
            } else {
                const comment = new Comment({
                    content: req.body.content,
