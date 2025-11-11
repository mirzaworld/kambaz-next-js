"use client";

import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./greencheckmark";

export default function ModuleControlButtons (
    {
        moduleId,
        deleteModule,
        editModule,
    } : {
        moduleId : string;
        deleteModule : ( moduleId : string ) => void;
        editModule : ( moduleId : string ) => void;
    }
) {
    return (
        <div className = "d-inline-flex align-items-center gap-3 ms-auto text-nowrap flex-shrink-0" >
            <FaPencil
                onClick = {() => editModule( moduleId )}
                className = "text-primary fs-4"
                role = "button"
                aria-label = "Edit module"
            />
            <FaTrash
                className = "text-danger fs-4"
                onClick = {() => deleteModule( moduleId )}
                role = "button"
                aria-label = "Delete module"
            />
            <GreenCheckmark />
            <BsPlus className = "fs-4 text-dark" role = "button" aria-label = "Add item" />
            <IoEllipsisVertical className = "fs-4 text-dark" role = "button" aria-label = "More options" />
        </div>
    );
}
