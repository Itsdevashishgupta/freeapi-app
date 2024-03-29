import { Card } from '@/components/ui'
import React from 'react'
import { FaHome, FaRegBuilding } from 'react-icons/fa'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const Template = () => {
  const navigate=useNavigate()
  return (
    <div className='grid xl:grid-cols-5 sm:grid-cols-3 gap-4 cursor-pointer'>
      <Card 
      className=''
      onClick={()=>navigate('/app/crm/fileManager/project/templates/commercial')} 
      >  <div className='flex gap-4 '>
          <div className=' text-lg' ><FaRegBuilding/></div>
       <p> Commecial</p>
        </div></Card>
      <Card onClick={()=>navigate('/app/crm/fileManager/project/templates/residential')}>
        <div className='flex gap-4 '>
          <div className=' text-lg' ><FaHome/></div>
       <p> Residential</p>
        </div></Card>
      <Card onClick={()=>navigate('/app/crm/fileManager/project/templates/miscellaneous/subfolder?type=miscellaneous&folder=miscellaneous')}>  <div className='flex gap-4'>
          <div className=' text-lg ' ><MdOutlineMiscellaneousServices/></div>
       <p> Miscellaneous</p>
        </div></Card>
      
      </div>
  )
}

export default Template