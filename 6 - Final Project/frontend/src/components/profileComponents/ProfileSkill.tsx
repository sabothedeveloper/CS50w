import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { SkillData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';

interface ProfileSkillProps {
    skill: SkillData[];
    singleSkill: SkillData | null;
    setSingleSkill: React.Dispatch<React.SetStateAction<SkillData | null>>;
    setSkill: React.Dispatch<React.SetStateAction<SkillData[]>>;
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
    setEditSkill: React.Dispatch<React.SetStateAction<boolean>>;
    editSkill: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>

    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    deleteData: (
        editField: React.Dispatch<React.SetStateAction<boolean[]>> | undefined, 
        setData: GetDataFunction, 
        endpoint: string, 
        id: number
        ) => Promise<void>;
}

const ProfileSkill: React.FC<ProfileSkillProps> = ({
    skill, setSkill, editSkill, getData,
    setEditSkill, editMultipleData, sendMultipleData,singleSkill, setSingleSkill,
     multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{



    const resetSkill = () => {
        setSingleSkill(null);
      };

    const saveSkill = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        sendMultipleData(singleSkill, setEditSkill, setSkill, 
            resetSkill, '/profile/skill', 'addskill');
    }

    const deleteSkill = (id: number) => {
        deleteData(undefined, setSkill, '/profile/skill', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleSkill((prevSkill) => ({
        ...prevSkill!,
        [name]: value,
        }));
    
  
        
      };

    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Skills</p>
                    </div>
                   
                    <div className='row flex'>
                        <form>
                            <div className='container'>
                                <div className='mb-3'>
                                    <div className='row align-items-end'>
                                    <p>Enter your skills <b>one at a time</b> by approving with the "Add" button:</p>
                                        <div className='col'>
                                            <label htmlFor={`skill`} className='form-label'>
                                                Skill:
                                            </label>
                                            <input
                                                type='text'
                                                name={`skill`}
                                                className={`form-control${renderFieldErrorMultiple('addskill', 0, `skill`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                value={singleSkill?.skill || ''}
                                                onChange={handleSingleInputChange}
                                                placeholder='TypeScript'
                                            />
                                        </div>
                                        <div className='col align-items'>
                                            <button className='btn btn-primary' onClick={(e) => saveSkill(e)}>
                                                Add Skill
                                            </button>
                                        </div>
                                    </div>
                                    {renderFieldErrorMultiple('addskill', 0, `skill`, multipleErrors)}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className='container'>
                        <div className='row flex mb-3'>
                            {skill.map((skill, index) => (
                                <div key={index} className='col-auto'>
                                    
                                    
                                        {/* <button className='btn btn btn-outline-secondary btn-sm' onClick={() => editMultipleSkillsButton(index, skill.id)}>
                                            <Icon path={mdiPencil} size={1} />
                                        </button> */}
                                        <div className='profile-skill'>
                                        {skill?.skill || ''}
                                        {/* <button type="button" className="btn-close" >
                                        </button> */}
                                        <svg height="0.75rem" width="0.75rem" version="1.1" id="Capa_1"  
                                            viewBox="0 0 460.775 460.775" onClick={() => deleteSkill(skill.id)}>
                                        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                                            c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                                            c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                                            c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                                            l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                                            c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                                        </svg>
                                        </div>
                                        
                                    
                                    {/* {!editMultipleSkills[index] && (
                                    <div className='col-auto col-md-8 col-sm-6 text-start'>

                                        <p>{skill?.skill || ''}</p>
                                        <p>{skill?.skill_level || ''}</p>

                                    </div>
                                    
                                    )} */}
                                    
                                    
                                </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProfileSkill;