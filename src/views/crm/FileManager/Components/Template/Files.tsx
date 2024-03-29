import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Dialog, Notification, toast } from '@/components/ui';
import { StickyFooter } from '@/components/shared';
import CreatableSelect from 'react-select/creatable';
import { CiFileOn } from 'react-icons/ci';
import { getTemplateData } from '../data';
import {  FileItem } from '../type';
import { apiDeleteFileManagerFiles, apiGetCrmFileManagerShareFiles } from '@/services/CrmService';

const Index = () => {
  const [leadData, setLeadData] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const folderName = queryParams.get('folder');
  const type = queryParams.get('type');
  const subfolder = queryParams.get('subfolder');
  const folderId = queryParams.get('folder_id');
  
  const navigate=useNavigate()

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };

  const [dialogIsOpen, setIsOpen] = useState(false)

  const openDialog = () => {
      setIsOpen(true)
  }

  const onDialogClose = () => {
      setIsOpen(false)
  }

  useEffect(() => {
    const fetchDataAndLog = async () => {
      try {
        const templateData = await getTemplateData();
        console.log(templateData);
  
        // Filter folders based on query parameters
        const filteredFolders = templateData.filter((folder) => {
          return (
            folder.files[0].folder_name === type &&
            folder.files[0].sub_folder_name_first === folderName &&
            folder.files[0].sub_folder_name_second === subfolder
          );
        });
  console.log(filteredFolders);
  
        if (filteredFolders.length > 0) {
          setLeadData(filteredFolders[0].files[0].files);
        } else {
          console.warn('No matching folder found.');
          // Handle case where no matching folder is found based on query parameters
        }
  
        console.log(leadData);
        
      } catch (error) {
        console.error('Error fetching lead data', error);
      }
    };
  
    fetchDataAndLog();
  }, [type, folderName, subfolder]);

  const handleFileSelect = (fileId: string) => {
    const updatedSelectedFiles = selectedFiles.includes(fileId)
      ? selectedFiles.filter((id) => id !== fileId)
      : [...selectedFiles, fileId];
    setSelectedFiles(updatedSelectedFiles);

  };

  const deleteFiles = async () => {
    function warn(text:string) {
      toast.push(
          <Notification closable type="warning" duration={2000}>
              {text}
          </Notification>,{placement:'top-center'}
      )
  }
    if (selectedFiles.length === 0) {
      warn('No files selected for deletion.')
      return;
    }
    
    const postData = {
      file_id: selectedFiles,
      folder_name: subfolder,
      type:'template',
    };
    try {
      const response=await apiDeleteFileManagerFiles(postData);
      const responseJson=await response.json()
      console.log(responseJson);
      
      if (response.ok) {
        toast.push(
          <Notification closable type="success" duration={2000}>
            Files deleted successfully
          </Notification>,{placement:'top-center'}
        )
        window.location.reload()
      }
      else{
        toast.push(
          <Notification closable type="danger" duration={2000}>
            {responseJson.errorMessage}
          </Notification>,{placement:'top-center'}
        )
      }
    
    } catch (error) {
      console.error('Error deleting files:', error);
    }
    
  }

  const handleShareFiles = async () => {

    if (selectedFiles.length === 0 || selectedEmails.length === 0) {
        warn('No files or email addresses selected for sharing.')
        return
    }
  
    const postData = {
      folder_id:folderId,
        type:'template',
      file_id: selectedFiles,
      email: selectedEmails,
      subject: subject,
      body: body,
    };

      function closeAfter2000ms() {
      toast.push(
          <Notification closable type="success" duration={2000}>
              Successfully Shared
          </Notification>
      )
  }

      function warn(text: string) {
          toast.push(
              <Notification closable type="warning" duration={2000}>
                  {text}
              </Notification>,
              { placement: 'top-center' },
          )
      }

    try {
      const response = await apiGetCrmFileManagerShareFiles(postData);
  
      if (!response.ok) {
        console.error('Error sharing files:', response.statusText);
        return;
      }
  
      const responseData = await response.json();
  
      console.log('Files shared successfully:', responseData);
  
      setSelectedFiles([]);
      setSelectedEmails([]);
      setSubject('')
      setBody('')
      onDialogClose()
      closeAfter2000ms()
      const updatedLeadData = leadData.map((file) => ({ ...file, active: false }));
      setLeadData(updatedLeadData);
    } catch (error) {
      console.error('Error sharing files:', error);
    }
  };



  return (
    <div>
        <div className='flex justify-between'>
      <h3 className='mb-5'>Files</h3>
      <div>
        <Button variant='solid' color='red-600' className='mr-3' type='button' onClick={()=>deleteFiles()}>Delete</Button>
      <Button
       variant='solid'
       onClick={() => openDialog()}
      >Share</Button>
      </div>
      </div>
      {leadData && leadData.length > 0 ? (
        <div className='grid grid-cols-2 xl:grid-cols-6 sm:grid-cols-4  gap-4'>
          {leadData.map((file) => {
          if (!file || typeof file.fileName !== 'string') {
            return null; 
          }
  
          const fileExtension = file.fileName.split('.').pop().toLowerCase();
  
          return (
            <a key={file.fileId} href={file.fileUrl} target='_blank' rel='noreferrer' >
              <div
                key={file.fileId}
                className='min-h-[200px] max-h-[250px] flex justify-between'
              >
                <Checkbox
                  checked={selectedFiles.includes(file.fileId)}
                  onChange={() => handleFileSelect(file.fileId)}
                />
                <div className='flex items-center flex-col justify-center'>
                  {['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension) ? (
                    <img src={file.fileUrl} alt={file.fileName} className='h-auto w-auto max-h-[140px]' />
                  ) : (
                    <span  ><CiFileOn className=' text-8xl'/></span>
                  )}
                   <p className='capitalize text-wrap overflow-hidden overflow-ellipsis whitespace-nowrap' style={{ overflowWrap: "anywhere" }}>
    {file.fileName.length > 20 ? `${file.fileName.substring(0, 20)}...` : file.fileName}
  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
         ) : (
          <p>Add files</p>
        )}
      <StickyFooter
        className="-mx-8 px-8 flex items-center justify-between py-4 mt-7"
        stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <div className="md:flex items-center">
          <Button
            size="sm"
            className="ltr:mr-3 rtl:ml-3"
            type="button"
            onClick={() => {
            navigate(-1)
            }}
          >
            Back
          </Button>
          <Button size="sm" variant="solid" type="submit" onClick={handleShareFiles}>
            Share
          </Button>
        </div>
      </StickyFooter>
      <Dialog
                isOpen={dialogIsOpen}
                style={{}}
                className='max-h-[300px]'
                onClose={onDialogClose} 
                onRequestClose={onDialogClose}

            >
              <h3 className='mb-5'>Share Files</h3>

          <CreatableSelect
          
    isMulti
    value={selectedEmails.map((email) => ({ label: email, value: email }))}
    
    placeholder="Add email addresses..."
    onChange={(newValues) => {
      const emails = newValues ? newValues.map((option) => option.value) : [];
      setSelectedEmails(emails);
    }}
    onCreateOption={(inputValue) => {
      const newEmails = [...selectedEmails, inputValue];
      setSelectedEmails(newEmails);
    }}
  />

<div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700'>Subject</label>
          <input
            type='text'
            className='mt-1 p-2 w-full border rounded-md'
            value={subject}
            placeholder='Enter subject...'
            onChange={handleSubjectChange}
          />
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700'>Body</label>
          <textarea
            className='mt-1 p-2 w-full border rounded-md'
            value={body}
            placeholder='Enter body...'
            onChange={handleBodyChange}
          />
        </div>
  
         <div className='flex justify-end'>
         <Button size="sm" variant="solid" type="submit" className='mt-5 ' onClick={handleShareFiles} >
            Share
          </Button>
          </div>
            </Dialog>
    </div>
  );
};

export default Index;
