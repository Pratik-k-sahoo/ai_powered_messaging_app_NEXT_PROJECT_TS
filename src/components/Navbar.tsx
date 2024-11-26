"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { ModeToggle } from "./themeBtn";
import Image from "next/image";

const Navbar = () => {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = React.useState(false);

	const user: User = session?.user as User;
	return (
		<nav className="dark:bg-gray-500 bg-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<Image width={8} height={8} className="h-8 w-8" src="/your-logo.png" alt="Logo" />
						</div>
						<div className="hidden md:block">
							<div className="ml-10 flex items-baseline space-x-4">
								{["Home", "About", "Services", "Contact"].map((item) => (
									<a
										key={item}
										href="#"
										className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:-translate-y-1"
									>
										{item}
									</a>
								))}
							</div>
						</div>
					</div>
					<div className="hidden md:block">
						<div className="ml-4 flex items-center md:ml-6">
							{session ? (
								<>
									<span>Welcome, {user?.username || user?.email}</span>
									<button
										className="ml-4 bg-blue-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-300 ease-in-out transform hover:-translate-y-1"
										onClick={() => signOut()}
									>
										SignOut
									</button>
								</>
							) : (
								<>
									<Link href={"/sign-in"}>
										<button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-1">
											Login
										</button>
									</Link>
									<Link href={"/sign-up"}>
										<button className="ml-4 bg-blue-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-300 ease-in-out transform hover:-translate-y-1">
											Sign Up
										</button>
									</Link>
								</>
							)}
							<ModeToggle />
						</div>
					</div>
					<div className="-mr-2 flex md:hidden items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							type="button"
							className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							{!isOpen ? (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16m-7 6h7"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							)}
						</button>
						<ModeToggle />
					</div>
				</div>
			</div>

			{isOpen && (
				<div className="md:hidden" id="mobile-menu">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{["Home", "About", "Services", "Contact"].map((item) => (
							<a
								key={item}
								href="#"
								className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1"
							>
								{item}
							</a>
						))}
						{session ? (
							<>
								<span>Welcome, {user?.username || user?.email}</span>
								<button
									className="ml-4 bg-blue-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-300 ease-in-out transform hover:-translate-y-1"
									onClick={() => signOut()}
								>
									SignOut
								</button>
							</>
						) : (
							<>
								<Link href={"/sign-in"}>
									<button className="w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1">
										Login
									</button>
								</Link>
								<Link href={"/sign-up"}>
									<button className="w-full mt-2 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-300 ease-in-out transform hover:-translate-y-1">
										Sign Up
									</button>
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
