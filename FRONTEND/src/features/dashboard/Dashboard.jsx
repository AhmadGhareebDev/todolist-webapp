import { useEffect, useState } from "react";
import api from "../../api/api";
import allTasksSVG from '../../assets/allTasks.svg'
import overDueSVG from '../../assets/undraw_warnings_agxg.svg'
import doneSVG from '../../assets/undraw_done_i0ak.svg'
import ratioSVG from '../../assets/undraw_personal-goals_f9bb.svg'
import Louder from "../../components/Loaders/Louder";

export default function Dashboard() {

  const [tasksCount , setTasksCount] = useState(0);
  const [error , setError] = useState('')
  const [successfullyFinishedTasks , setSuccessfullyFinishedTasks ] = useState(0)
  const [overDueTasks , setOverDueTasks] = useState(0)
  const [isLoading , setIsLoading] = useState(true)

  const finishingPercentage = tasksCount > 0
  ? ((successfullyFinishedTasks / tasksCount) * 100).toFixed(1)
  : "0";

  useEffect(() => {

    getTasksNumber()
  },[])

  const getTasksNumber = async () => {
    try {

      setIsLoading(true)
      const response = await api.statisticsApis.getTasksNumber()
      if(response.success) {
        setTasksCount(response.data.tasksCounter)
        setOverDueTasks(response.data.overDueTasks)
        setSuccessfullyFinishedTasks(response.data.tasksFinishedBeforDeadLine)
      }else {
        setError(response.message)
      }

    }catch (error) {
      setError(error)
    }finally{
      setIsLoading(false)
    }
  }

  


  return (
    <div className="  grid grid-cols-1 mt-10 sm:grid-cols-2 p-3 gap-4">
      <p className="absolute top-1 text-md font-semibold text-red-500  z-10">{error}</p>

      <Card data={tasksCount}  image={allTasksSVG} color={'from-blue-100'} title={'tasks Created'} textStyle={'text-blue-600'} isLoading={isLoading} />
      <Card data={successfullyFinishedTasks}  image={doneSVG} color={'from-green-300 '} title={'finished'} textStyle={' text-accent-900'} isLoading={isLoading}/>
      <Card data={overDueTasks}  image={overDueSVG} color={'from-red-300'} title={'overDue'} textStyle={'text-red-500'}/>
      <Card data={finishingPercentage + '%'}  image={ratioSVG} color={'from-blue-100'} title={'Finishing Ratio'} textStyle={'text-blue-600'} isLoading={isLoading} />



     
    </div>
  );
}




const Card = ({data , image , color , title , textStyle , isLoading}) => {


  return (
     <div className={`${textStyle} flex sm:flex flex-col p-4  bg-gradient-to-b ${color}  h-100 rounded-2xl shadow-lg hover:translate-y-1 transition-all duration-300`}>
        <div>
          <div className={`text-4xl font-bold ${textStyle}`}>{isLoading? <div className="scale-60"><Louder/></div> : data}</div>
        <div className={`text-gray-600 text-2xl font-bold ${textStyle}`}>{title}</div>
      
          <img src={image} className={` max-h-[300px] hover:scale-101  transition-all duration-300`}/>
        
        </div>
    
      </div>
  )

}