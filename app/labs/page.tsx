import Link from "next/link";

export default function labs() {
    return (
        <div id = "wd-labs" >
            <h1> Labs </h1>
            <div id= "wd-student-name" style = {{fontSize: "21px", color: "red" }} > Mirza Saad Ali Baig</div>
            <ul>
                <li>
                    <Link href = "/labs/lab1" id = "wd-lab1-link">
                    Lab 1: HTML Examples </Link>
                </li>

                <li>
                    <Link href = "/labs/lab2" id = "wd-lab2-link" >
                    Lab 2: CSS Basics </Link>
                </li>

                <li> 
                    <Link href = "/labs/lab3" id = "wd-lab3-link" > 
                    Lab 3: JavaScript Fundamentals </Link>
                </li>

                <li> 
                    <Link href = "/labs/lab4" id = "wd-lab4-link" > 
                    Lab 4: Maintaining State in React Applications </Link>
                </li>

                <li> 
                    <Link href = "/labs/lab5" id = "wd-lab5-link" > 
                    Lab 5: Implementing RESTful Web APIs with Express.js </Link>
                </li>
                    
                <li>
                    <Link href = "/" id = "wd-kambaz-link" >
                    Kambaz </Link>
                </li>

                <li> 
                    <Link id = "wd-github" href = "https://github.com/mirzaworld/kambaz-next-js" target = "_blank" rel = "noreferrer"> My Github Repository (next-js) </Link>
                </li>

                <li>
                    <Link id = "wd-github-2" href = "https://github.com/mirzaworld/kambaz-node-server-app" target = "_blank" rel = "noreferrer"> Github Repository (node-server) </Link>
                </li>
                
            </ul>
            
        </div>
    );
}