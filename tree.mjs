import madge from 'madge'

madge('../my-app/src/App.jsx').then((res) => {
    console.log(res.obj())
})
