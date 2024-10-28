import { useState, useRef, useEffect } from 'react';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UpdatePost = () => {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { postId } = useParams();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();

                if (!res.ok) {
                    setPublishError(data.message || 'Error fetching post');
                    return;
                }
                
                setPublishError(null);
                setFormData(data.posts[0]);
            } catch (error) {
                console.log('Fetch post error:', error);
                setPublishError('Error fetching post');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPost();
    }, [postId]);

    const quillRef = useRef(null);

    const handleUploadImage = async () => {
        if (!file) {
            setImageUploadError('Please select an image');
            return;
        }
        setImageUploadError(null);

        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
                console.log('Image upload error:', error);
                setImageUploadError('Image upload failed');
                setImageUploadProgress(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUploadProgress(null);
                    setImageUploadError(null);
                    setFormData({ ...formData, image: downloadURL });
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData._id) {
            setPublishError('Post ID is missing');
            return;
        }

        if (!currentUser?._id) {
            setPublishError('User ID is missing');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) {
                setPublishError(data.message || 'Error updating post');
                return;
            }

            setPublishError(null);
            navigate(`/post/${data.slug}`);
        } catch (error) {
            console.log('Update post error:', error);
            setPublishError('Something went wrong while updating');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p className="text-center my-10">Loading post data...</p>;
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput 
                        type='text'
                        placeholder='Title'
                        required 
                        id='title'
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData.title || ''}
                    />

                    <Select
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData.category || ''}
                    >
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="reactjs">React.js</option>
                        <option value="nextjs">Next.js</option>
                    </Select>
                </div>

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button 
                        type='button' 
                        gradientDuoTone='purpleToBlue' 
                        size='sm' 
                        outline 
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : 'Upload Image'}
                    </Button>
                </div>

                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img src={formData.image} alt='upload' className='w-full h-72 object-cover' />
                )}

                <ReactQuill
                    theme='snow'
                    placeholder='Write something'
                    className='h-72 mb-12'
                    value={formData.content || ''}
                    ref={quillRef}
                    required
                    onChange={(value) => setFormData({ ...formData, content: value })}
                />

                <Button type='submit' gradientDuoTone='purpleToPink' disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update post'}
                </Button>
                {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
            </form>
        </div>
    );
};

export default UpdatePost;
