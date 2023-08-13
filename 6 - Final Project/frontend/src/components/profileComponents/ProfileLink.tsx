import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { LinkData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';

interface ProfileLinkProps {
    link: LinkData[];
    singleLink: LinkData | null;
    setSingleLink: React.Dispatch<React.SetStateAction<LinkData | null>>;
    setLink: React.Dispatch<React.SetStateAction<LinkData[]>>;
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
    setEditLink: React.Dispatch<React.SetStateAction<boolean>>;
    editLink: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    editMultipleLinks: boolean[];
    setEditMultipleLinks: React.Dispatch<React.SetStateAction<boolean[]>>;
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

const ProfileLink: React.FC<ProfileLinkProps> = ({
    link, setLink, editLink, getData,
    setEditLink, editMultipleData, sendMultipleData,singleLink, setSingleLink,
    editMultipleLinks, setEditMultipleLinks, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{

    const editMultipleLinksButton = async (index: number, id?: number) => {
        if (editMultipleLinks[index] === true){
           await cancelEditMultipleLinks(index, id)
           return
        }
        setEditMultipleLinks((prevEditLinks) => {
          const newEditLinks = [...prevEditLinks];
          newEditLinks[index] = !prevEditLinks[index];
          return newEditLinks;
        });
        
    }

    
    const cancelEditMultipleLinks = async (index: number, id?: number) => {
        setEditMultipleLinks((prevEditLinks) => {
          const newEditLinks = [...prevEditLinks];
          newEditLinks[index] = false;
          return newEditLinks;
        });
        removeMultipleErrors('link', index)
        await getData(setLink, '/profile/link');

      };

    const editLinkButton = () =>{
        setEditLink(!editLink);
        if(editLink === true){
            removeMultipleErrors('addlink', 0)
            setSingleLink(null)
            getData(setLink, '/profile/link');
        }
        
    }
    const cancelEditLink = async () =>{
        setEditLink(false);
        removeMultipleErrors('addlink', 0)
        // await getLinkData();
        setSingleLink(null)
    }

    const saveEdit = async (index: number, id?: number) =>{

        editMultipleData(link, setEditMultipleLinks, setLink, 
            '/profile/link', 'link', index, id)
        // setEditPersonal(false);
    }

    const resetLink = () => {
        setSingleLink(null);
      };

    const saveLink = () => {
        sendMultipleData(singleLink, setEditLink, setLink, 
            resetLink, '/profile/link', 'addlink');
    }

    const deleteLink = (id: number) => {
        deleteData(setEditMultipleLinks, setLink, '/profile/link', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleLink((prevLink) => ({
        ...prevLink!,
        [name]: value,
        }));
    
  
        
      };
    const handleLinkInputChange = (
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
    
        setLink((prevLink) => {
        const updatedLinks = [...prevLink];
        updatedLinks[index] = {
            ...updatedLinks[index],
            ...updatedProperty, 
        };
        return updatedLinks;
        });
    };
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Links</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editLinkButton}>
                                Add
                            </button>
                        </div>
                    </div>
                    {!link[0] && !editLink &&
                    <div className='container'> 
                        <p className='text-secondary my-4'>
                            Elevate Your CV: Include your GitHub, LinkedIn, and personal projects to enrich your CV 
                            and showcase your professional achievements.
                        </p>
                    </div>
                    
                    }
                    {editLink && (
                        <div className='container'>
                            <form>
                            <div className='row'>
                            <div className='mb-3 col-4'>
                                <label htmlFor={`link_name`} className='form-label'>
                                    Name:
                                </label>
                                <input
                                    type='text'
                                    name={`link_name`}
                                    className={`form-control${renderFieldErrorMultiple('addlink', 0, `link_name`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleLink?.link_name || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Github'
                                />
                                {renderFieldErrorMultiple('addlink', 0, `link_name`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`link`} className='form-label'>
                                    Link:
                                </label>
                                <input
                                    type='text'
                                    name={`link`}
                                    className={`form-control${renderFieldErrorMultiple('addlink', 0, `link`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleLink?.link || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='https://github.com/wojwoj8/AppliGate'
                                />
                                {renderFieldErrorMultiple('addlink', 0, `link`, multipleErrors)}
                                </div>
                                
 
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditLink}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveLink}>
                                Save
                            </button>
                            </div>
                        </div>
                        )}
                {link.map((link, index) => (
                    <div key={index} className='text-center row'>
                        {index >= 1 && <hr className="border border-primary border-3 my-1"></hr>}
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => editMultipleLinksButton(index, link.id)}>
                                <Icon path={mdiPencil} size={1} />
                            </button>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => deleteLink(link.id)}>
                                Delete
                            </button>
                        </div>
                        {!editMultipleLinks[index] && (
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            
                            <p>{link?.link_name || ''}</p>
                            <a href={link?.link} target='_blank' rel="noreferrer"><p>{link?.link || ''}</p></a>
                            

                        </div>
                        
                        )}
                        
                        {editMultipleLinks[index] && (
                        <div className='container'>
                            <form>
                                <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor={`link_name_${index}`} className='form-label'>
                                       Name:
                                    </label>
                                    <input
                                        type='text'
                                        name={`link_name_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('link', index, `link_name_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={link?.link_name || ''}
                                        onChange={(e) => handleLinkInputChange(index, e)}
                                        placeholder='Github'
                                    />
                                    {renderFieldErrorMultiple('link', index, `link_name_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`link_${index}`} className='form-label'>
                                        Link:
                                    </label>
                                    <input
                                        type='text'
                                        name={`link_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('link', index, `link_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={link?.link || ''}
                                        onChange={(e) => handleLinkInputChange(index, e)}
                                        placeholder='https://github.com/wojwoj8/AppliGate'
                                    />
                                    {renderFieldErrorMultiple('link', index, `link_${index}`, multipleErrors)}
                                    </div>
                                    
                                </div>

                                </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => cancelEditMultipleLinks(index, link.id)}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveEdit(index, link.id)}>
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
export default ProfileLink