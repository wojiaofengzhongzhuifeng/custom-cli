import {useEffect} from 'react';
const BOS3DComponent = ()=>{

  useEffect(()=>{
    const option = {host: "https://bos3d.bimwinner.com", viewport: "viewport"};
    const viewer3D = new BOS3D.Viewer(option);
    viewer3D.addView("M1598257565598", "he3285593fdc4ea3b91784c5741ff8aa");
    viewer3D.registerModelEventListener(window.BOS3D.EVENTS.ON_LOAD_COMPLETE, function () {
      viewer3D.flyTo({"position":{"x":17516.55516689178,"y":55074.866969890405,"z":-148081.89444906908},"target":{"x":29581.341524520445,"y":16857.879928980838,"z":5829.884063979029},"up":{"x":0,"y":0,"z":1}})
    })
  }, [])

  return (
    <div style={{width: '100vw', height: '100vh', border: '1px solid red'}} id='viewport'></div>
  )
};
export default BOS3DComponent
