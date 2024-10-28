import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import {useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateFailure,updateSuccess,deleteUserFailure,deleteUserSuccess,deleteUserStart,signoutSuccess } from '../redux/user/userslice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const DashProfile = () => {
    const {currentUser,error,loading} = useSelector(state =>state.user)
    const [imagefile, setImagefile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileuploadProgress, setImageFileuploadProgress] = useState(null)
    const [imageFileuploadError, setImageFileuploadError] = useState(null)  
    const [imageFileuploading, setImageFileuploading] = useState(false)
    const [updateUserSuccess, setupdateUserSuccess] = useState(null)
    const [updateUserError, setupdateUserError] = useState(null)
    const [showModal, setshowModal] = useState(false)
    const [formData, setFormData] = useState({})  
    const dispatch = useDispatch()
    const filePickerRef = useRef(null)
    const handleImageChange = (e) =>{
        const file = e.target.files[0];
        if (file) {
            setImagefile(file);
            setImageFileUrl(URL.createObjectURL(file))
        }
    };
useEffect(()=>{
    if (imagefile) {
        uploadImage();
    }
},[imagefile])   
   const uploadImage = async()=>{
    setImageFileuploading(true)
    setImageFileuploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imagefile.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,imagefile);

    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress = 
        (snapshot.bytesTransferred / snapshot.totalBytes)*100;
        setImageFileuploadProgress(progress.toFixed(0))
      },
      (error)=>{
        setImageFileuploadError('could not upload image(File must be less than 2MB)');
        setImageFileuploadProgress(null);
        setImagefile(null);
        setImageFileUrl(null);
        setImageFileuploading(false)

      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadurl)=>{
          setImageFileUrl(downloadurl)
          setFormData({...formData,profilepicture:downloadurl});
          setImageFileuploading(false);
        })
      }
      
    )


   } 
   const handleChange = (e) =>{
    setFormData({...formData,[e.target]:e.target.value});
   }
   
   const handleSubmit = async (e) =>{
    e.preventDefault();
    setupdateUserError(null);
    setupdateUserSuccess(null);
    if (Object.keys(formData).length ===0) {
      setupdateUserError('No changes made')
      return
    }
    if (imageFileuploading) {
      setupdateUserError('please wait for image to upload')
      return
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',  // Ensure the method is PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Your updated data
      });
      
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message))
        setupdateUserError(data.message)
      }else{
        dispatch(updateSuccess(data))
        setupdateUserSuccess("User profile updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setupdateUserError(error.message)

    }
   }
   const handleDeleteUser = async ()=>{
    setshowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
      }else{
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
   }

   const handleSignout = async ()=>{
    try {
      const res = await fetch('/api/user/signout',{
        method:'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }else{
        dispatch(signoutSuccess())
      }
    } catch (error) {
      console.log(error.message);
      
    }
   }
  return (
    <div className='max-w-lg max-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
        onClick={()=>filePickerRef.current.click()}>

          {imageFileuploadProgress && (
            <CircularProgressbar value={imageFileuploadProgress || 0} text={`${imageFileuploadProgress}%`}
            strokeWidth={5}
            styles={{
              root:{
                width:'100%',
                height:'100%',
                position:'absolute',
                top:0,
                left:0
              },
              path:{
                stroke:`rgba(62,152,199,${imageFileuploadProgress / 100})`
              }
            }}
            
            />
          )
          }

        <img src={imageFileUrl || currentUser.profilepicture} alt="user" 
        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileuploadProgress && imageFileuploadProgress < 100 && 'opacity-60'}`}/>
        </div>
          {imageFileuploadError &&  <Alert color='failure'>{imageFileuploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='username'
        defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='email'
        defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
       <Button type='submit' gradientDuoTone='purpleToBlue'outline disabled={loading || imageFileuploading}>
         {loading ?'Loading...':'update'}
       </Button>
       {
        currentUser.isAdmin &&(
          <Link to={'/create-post'}>
          <Button
          type='button'
          gradientDuoTone='purpleToPink'
          className='w-full'>
            Create a post
          </Button>
          </Link>
        )
       }
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
      <span onClick={()=>setshowModal(true)} className='cursor-pointer'>Delete Account</span>
      <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={()=>setshowModal(false)} 
        popup
        size='md'
        >
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-500'>Are you sure you want to delete your account</h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleDeleteUser}>Yes, I'am sure</Button>
                <Button color='gray' onClick={()=>setshowModal(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  )
}

export default DashProfile
