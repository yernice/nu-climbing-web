import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header.jsx"
import Home from "./pages/Home.jsx"
import Blog from "./pages/Blog.jsx"
import Post from "./pages/Post.jsx"
import Projects from "./pages/Projects.jsx"
import Learning from "./pages/Learning.jsx"
import Course from "./pages/Course.jsx"
import About from "./pages/About.jsx"

function App() {    
    
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/blog" element={<Blog/>}/>
                <Route path="/blog/:id" element={<Post/>}/>
                <Route path="/projects" element={<Projects/>}/>
                <Route path="/learning" element={<Learning/>}/>
                <Route path="/learning/:id" element={<Course/>}/>
                <Route path="/about" element={<About/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App