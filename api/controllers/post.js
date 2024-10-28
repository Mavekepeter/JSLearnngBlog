import post from "../models/post.js";
import { errorHandler } from "../utils/error.js"

export const create = async(req,res,next)=>{
    if (!req.user.isAdmin) {
        return next(errorHandler(403,'You are not allowed to create a post'))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400,'please provide all required fields'))
    }
    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new post({
        ...req.body,slug, userId: req.user.id
    });
    try {
        const savedpost = await newPost.save();
        res.status(201).json(savedpost)
    } catch (error) {
        next(error)
    }
}
export const getposts =async (req,res,next)=>{
    try {
        const startIndex = parseInt(req.query.limit) || 0;
        const limit = parseInt(req.query.limit)|| 1000;
        const sortDirection = req.query.order ==='asc' ? 1 :-1;
        const posts = await post.find({
            ...(req.query.userId &&{userId: req.query.userId}),
            ...(req.query.category &&{category: req.query.category}),
            ...(req.query.slug &&{slug: req.query.slug}),
            ...(req.query.postId &&{_id: req.query.postId}),
            ...(req.query.searchTerm &&{
                $or:[
                    { title:{$regex: req.query.searchTerm, $options:'i'} },
                    { content:{$regex: req.query.searchTerm, $options:'i'} },
                ]
            }),
    }).sort({updatedAlt:sortDirection}).skip(startIndex).limit(limit);
    const totalposts = await post.countDocuments();

    const now = new Date(); // Initialize the current date
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );
    const lastmonthPosts = await post.countDocuments({
        createdAt:{$gte:oneMonthAgo},
    });
    res.status(200).json({
        posts,
        totalposts,
        lastmonthPosts
    })
    } catch (error) {
        next(error)
    }
}
export const deletepost =async(req,res,next)=>{
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403,'You are not allowed to delete this post')) 
    }
    try {
        await post.findByIdAndUpdate(req.params.postId);
        res.status(200).json('The post as been deleted')
    } catch (error) {
        next(error)
    }
}
export const updatepost = async (req,res,next)=>{
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'));
      }
      try {
        const updatedPost = await post.findByIdAndUpdate(
          req.params.postId,
          {
            $set: {
              title: req.body.title,
              content: req.body.content,
              category: req.body.category,
              image: req.body.image,
            },
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        next(error);
      }
};
