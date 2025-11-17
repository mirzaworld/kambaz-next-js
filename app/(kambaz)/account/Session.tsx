"use client";
import React, { useEffect, useState } from "react";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Session( { children } : { children: any } ) {
  const [ pending, setPending ] = useState( true );
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch( setCurrentUser( currentUser ) );
    } catch ( err ) {
      // no current session
    }
    setPending( false );
  };

  useEffect( () => { fetchProfile(); }, [] );
  // Render children once pending is false (profile fetched)
  if (!pending) return children;
  // While pending, render a small invisible placeholder so layout still mounts
  return null;
}
