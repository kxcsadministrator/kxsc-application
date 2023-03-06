import React, {useEffect, useState} from 'react'

function Dark() {
  const [theme, setTheme] = useState(false);

  const handleClick=()=>{
    setTheme(!theme)
  }
  useEffect(() => {
    if(theme===true){
      document.body.classList.add('dark');
    }else{
      document.body.classList.remove('dark');
    }
  })
  return (
    <div>
      <button className='dark_btn' onClick={handleClick}>{theme?"Light":"Dark"}</button>
      
    </div>
  )
}

export default Dark;