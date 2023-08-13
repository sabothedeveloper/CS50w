import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { CourseData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';

interface ProfileCourseProps {
    course: CourseData[];
    singleCourse: CourseData | null;
    setSingleCourse: React.Dispatch<React.SetStateAction<CourseData | null>>;
    setCourse: React.Dispatch<React.SetStateAction<CourseData[]>>;
    editMultipleData: (
        state: EditMultipleDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: GetDataFunction, 
        endpoint: string, 
        errorField: string, 
        index: number,
        id: number | undefined
        ) => Promise<void>
    getData: (
        setData: GetDataFunction,
        endpoint: string,
        id?: number | undefined
        ) => void;
    setEditCourse: React.Dispatch<React.SetStateAction<boolean>>;
    editCourse: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    editMultipleCourses: boolean[];
    setEditMultipleCourses: React.Dispatch<React.SetStateAction<boolean[]>>;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    deleteData: (
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: GetDataFunction, 
        endpoint: string, 
        id: number
        ) => Promise<void>;
}

const ProfileCourse: React.FC<ProfileCourseProps> = ({
    course, setCourse, editCourse, getData,
    setEditCourse, editMultipleData, sendMultipleData,singleCourse, setSingleCourse,
    editMultipleCourses, setEditMultipleCourses, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{

    const editMultipleCoursesButton = async (index: number, id?: number) => {
        if (editMultipleCourses[index] === true){
           await cancelEditMultipleCourses(index, id)
           return
        }
        setEditMultipleCourses((prevEditCourses) => {
          const newEditCourses = [...prevEditCourses];
          newEditCourses[index] = !prevEditCourses[index];
          return newEditCourses;
        });
        
    }

    
    const cancelEditMultipleCourses = async (index: number, id?: number) => {
        setEditMultipleCourses((prevEditCourses) => {
          const newEditCourses = [...prevEditCourses];
          newEditCourses[index] = false;
          return newEditCourses;
        });
        removeMultipleErrors('course', index)
        await getData(setCourse, '/profile/course');

      };

    const editCourseButton = () =>{
        setEditCourse(!editCourse);
        if(editCourse === true){
            removeMultipleErrors('addcourse', 0)
            setSingleCourse(null)
            getData(setCourse, '/profile/course');
        }
        
    }
    const cancelEditCourse = async () =>{
        setEditCourse(false);
        removeMultipleErrors('addcourse', 0)
        // await getCourseData();
        setSingleCourse(null)
    }

    const saveEdit = async (index: number, id?: number) =>{

        editMultipleData(course, setEditMultipleCourses, setCourse, 
            '/profile/course', 'course', index, id)
        // setEditPersonal(false);
    }

    const resetCourse = () => {
        setSingleCourse(null);
      };

    const saveCourse = () => {
        sendMultipleData(singleCourse, setEditCourse, setCourse, 
            resetCourse, '/profile/course', 'addcourse');
    }

    const deleteCourse = (id: number) => {
        deleteData(setEditMultipleCourses, setCourse, '/profile/course', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleCourse((prevCourse) => ({
        ...prevCourse!,
        [name]: value,
        }));
    
  
        
      };
    const handleCourseInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        
    ) => {
        let { name, value } = event.target;
        name = name.substring(0, name.lastIndexOf('_'));
        // console.log(value)
        // Create an object with the new property and value
        const updatedProperty = {
        [name]: value,
        };
    
        setCourse((prevCourse) => {
        const updatedCourses = [...prevCourse];
        updatedCourses[index] = {
            ...updatedCourses[index],
            ...updatedProperty, 
        };
        return updatedCourses;
        });
    };
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Courses, training, certificates</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editCourseButton}>
                                Add
                            </button>
                        </div>
                    </div>
                    {!course[0] && !editCourse &&
                    <div className='container'> 
                        <p className='text-secondary my-4'>
                        Think of this section as your toolbox for success. Here, you can list all the courses you've taken, 
                        training you've undergone, and certificates you've earned. Just like adding tools to your toolkit, 
                        these details enhance your value to potential employers. The more you share, the more you showcase 
                        your dedication to learning and your readiness to tackle new challenges. So, fill it up and let your 
                        expertise shine!
                        </p>
                    </div>
                    
                    }
                    {editCourse && (
                        <div className='container'>
                            <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`course_name`} className='form-label'>
                                    Name:
                                </label>
                                <input
                                    type='text'
                                    name={`course_name`}
                                    className={`form-control${renderFieldErrorMultiple('addcourse', 0, `course_name`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleCourse?.course_name || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Name'
                                />
                                {renderFieldErrorMultiple('addcourse', 0, `course_name`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`organizer`} className='form-label'>
                                    Organizer:
                                </label>
                                <input
                                    type='text'
                                    name={`organizer`}
                                    className={`form-control${renderFieldErrorMultiple('addcourse', 0, `organizer`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleCourse?.organizer || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Organizer'
                                />
                                {renderFieldErrorMultiple('addcourse', 0, `organizer`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`certificate_link`} className='form-label'>
                                    Link:
                                </label>
                                <input
                                    type='text'
                                    name={`certificate_link`}
                                    className={`form-control${renderFieldErrorMultiple('addcourse', 0, `certificate_link`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleCourse?.certificate_link || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Link'
                                />
                                {renderFieldErrorMultiple('addcourse', 0, `certificate_link`, multipleErrors)}
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor={`finish_date`} className='form-label'>
                                        Finish:
                                    </label>
                                    <input 
                                        type="month" 
                                        name={`finish_date`}
                                        className={`form-control${renderFieldErrorMultiple('addcourse', 0, `finish_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleCourse?.finish_date || ''}
                                        onChange={handleSingleInputChange}                     
                                    />
                                    {renderFieldErrorMultiple('addcourse', 0, `finish_date`, multipleErrors)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditCourse}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveCourse}>
                                Save
                            </button>
                            </div>
                        </div>
                        )}
                {course.map((course, index) => (
                    <div key={index} className='text-center row'>
                        {index >= 1 && <hr className="border border-primary border-3 my-1"></hr>}
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => editMultipleCoursesButton(index, course.id)}>
                                <Icon path={mdiPencil} size={1} />
                            </button>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => deleteCourse(course.id)}>
                                Delete
                            </button>
                        </div>
                        {!editMultipleCourses[index] && (
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            
                            {course?.course_name && course?.certificate_link ? (
                                <p><a target='_blank' href={course?.certificate_link} rel="noreferrer">{course?.course_name}</a></p>
                            ) : (
                                <p>{course?.course_name}</p>
                            )} 
                            <p>{course?.organizer || ''}</p>

                            <p>{course?.finish_date}</p>
                        </div>
                        
                        )}
                        
                        {editMultipleCourses[index] && (
                        <div className='container'>
                            <form>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`course_name_${index}`} className='form-label'>
                                        Name:
                                    </label>
                                    <input
                                        type='text'
                                        name={`course_name_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('course', index, `course_name_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={course?.course_name || ''}
                                        onChange={(e) => handleCourseInputChange(index, e)}
                                        placeholder='Name'
                                    />
                                    {renderFieldErrorMultiple('course', index, `course_name_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`organizer_${index}`} className='form-label'>
                                       Organizer:
                                    </label>
                                    <input
                                        type='text'
                                        name={`organizer_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('course', index, `organizer_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={course?.organizer || ''}
                                        onChange={(e) => handleCourseInputChange(index, e)}
                                        placeholder='Organizer'
                                    />
                                    {renderFieldErrorMultiple('course', index, `organizer_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`certificate_link_${index}`} className='form-label'>
                                        Link:
                                    </label>
                                    <input
                                        type='text'
                                        name={`certificate_link_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('course', index, `certificate_link_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={course?.certificate_link || ''}
                                        onChange={(e) => handleCourseInputChange(index, e)}
                                        placeholder='Link'
                                    />
                                    {renderFieldErrorMultiple('course', index, `certificate_link_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`finish_date_${index}`} className='form-label'>
                                        Finish:
                                    </label>
                                    <input
                                        type='month'
                                        name={`finish_date_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('course', index, `finish_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={course?.finish_date || ''}
                                        onChange={(e) => handleCourseInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('course', index, `finish_date_${index}`, multipleErrors)}
                                    </div>
                                   
                                </div>
                                </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => cancelEditMultipleCourses(index, course.id)}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveEdit(index, course.id)}>
                                Save
                            </button>
                            </div>
                            
                        </div>
                        
                        )}
                        
                    </div>
                    ))}
            </div>
        </div>
        </div>
    )
}
export default ProfileCourse;