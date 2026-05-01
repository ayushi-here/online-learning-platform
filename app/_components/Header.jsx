"use client"
import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
    const {user} = useUser();
  return (
    <div className='flex justify-between items-center p-4'>
        <div className='flex gap-2 items center'>
            <Image src={"/logo.svg"} alt="Logo" width={30} height={30} />
            <h2 className='font-bold text-2xl'>CourseCraft</h2>
        </div>
        {!user?<SignInButton mode='modal'>
        <Button>SignIn/SignUp</Button>
        </SignInButton>:
        <Link href={"/workspace"}>
        <Button>Get Started</Button> </Link>}
        
    </div>
  )
}

export default Header