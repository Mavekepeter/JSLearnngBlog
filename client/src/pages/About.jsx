import React from 'react';
import aboutmaveke from '../assets/aboutmaveke.jpg'
const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-3">
        <div className="flex flex-col md:flex-row items-center gap-5">
          {/* Left Side - Image */}
          <div className="flex-shrink-0">
            <img
              src={aboutmaveke}
              alt="About"
              className="w-48 h-48 rounded-full object-cover"
            />
          </div>

          {/* Right Side - Text */}
          <div>
            <h1 className="text-3xl font-semibold text-center md:text-left my-5 md:my-0">About Maveke's Blog</h1>
            <div className="text-md text-gray-500 flex flex-col gap-5">
              <p>
                Maveke's Blog is a blog that I created to share my thoughts and ideas with the world. I am a software
                engineer, and I love to write about my experiences and things that I have learned. I hope you enjoy
                reading my blog.
              </p>
              <p>
                I'm passionate about using technology to solve real-world problems, and I firmly believe in the power of
                learning and collaboration. Maveke's Blog is a space where I share my coding experiments, thoughts on
                current tech trends, and insights into the software engineering industry. From exploring new frameworks
                to navigating career challenges, I hope my experiences can serve as a valuable resource for others on
                their own paths.
              </p>
              <p>
                As technology continues to evolve, staying updated can feel overwhelming. My goal with Maveke's Blog is
                to help break down complex topics, highlight practical solutions, and offer guidance to those navigating
                the software industry. I believe that knowledge should be accessible and that there’s something here for
                everyone, from newcomers to tech veterans. Thank you for joining me on this journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
