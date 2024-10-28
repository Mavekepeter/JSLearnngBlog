import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[300px] sm:h-[350px] overflow-hidden rounded-lg sm:w-[300px] lg:w-[280px] transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[180px] sm:h-[200px] w-full object-cover group-hover:h-[160px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-md font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-160px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-1 rounded-md !rounded-tl-none m-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
