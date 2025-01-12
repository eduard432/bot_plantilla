'use client'

import React from 'react'
import { FaMessage, FaBolt, FaShield, FaWandMagicSparkles   } from "react-icons/fa6"
import { useRouter } from 'next/navigation'

const features = [
    {
      icon: <FaMessage className="h-5 w-5 text-neutral-800" />,
      title: "Natural Conversations",
      description: "Experience human-like interactions with our advanced AI chatbot.",
    },
    {
      icon: <FaBolt className="h-5 w-5 text-neutral-800" />,
      title: "Lightning Fast",
      description: "Get instant responses powered by state-of-the-art AI technology.",
    },
    {
      icon: <FaShield className="h-5 w-5 text-neutral-800" />,
      title: "Secure & Private",
      description: "Your conversations are encrypted and completely private.",
    },
    {
      icon: <FaWandMagicSparkles className="h-6 w-6 text-neutral-800" />,
      title: "Smart Learning",
      description: "Our AI continuously learns and adapts to provide better responses.",
    },
  ];

const page = () => {

	const router = useRouter()

	return (
		<>
			<div className="min-h-screen bg-gradient-to-b from-background to-secondary">
				{/* Hero Section */}
				<div className="container mx-auto px-4 pt-20 pb-16">
					<div className="text-center max-w-3xl mx-auto">
						<h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-blue-600 mb-6">
							Next-Generation AI Chat Assistant
						</h1>
						<p className="text-lg md:text-xl text-neutral-500 mb-8">
							Experience the future of conversation with our intelligent AI chatbot.
							Powered by cutting-edge technology to understand and assist you better.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={() => router.push('/app')} className="h-11 rounded-md px-8 text-lg bg-neutral-900 text-neutral-50 font-semibold" >
                                Try it Free
                            </button>
                            <button className="h-11 rounded-md px-8 text-lg border semibold" >
                                Try it Free
                            </button>
						</div>
					</div>
				</div>

				{/* Features Section */}
				<div className="container mx-auto px-4 py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
								<div className="bg-neutral-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-neutral-500">{feature.description}</p>
							</div>
						))}
					</div>
				</div>

				{/* Demo Section */}
				<div className="container mx-auto px-4 py-16">
					<div className="bg-card rounded-xl p-8 shadow-lg">
						<div className="max-w-2xl mx-auto text-center mb-12">
							<h2 className="text-3xl font-bold mb-4">See it in Action</h2>
							<p className="text-muted-foreground">
								Watch how our AI chatbot handles real conversations with users, providing
								intelligent and contextual responses.
							</p>
						</div>
						<div className="aspect-video rounded-lg bg-secondary flex items-center justify-center">
							<div className="text-muted-foreground">Demo Video Placeholder</div>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="container mx-auto px-4 py-16 bg-neutral-900 text-neutral-50 rounded-xl">
					<div className="bg-primary rounded-xl p-8 text-primary-foreground text-center">
						<h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
						<p className="text-lg mb-8 max-w-2xl mx-auto font-semibold">
							Join thousands of users who are already experiencing the power of AI-driven
							conversations. Start your free trial today.
						</p>
                        <button className="h-11 rounded-md px-8 text-lg bg-neutral-50 text-neutral-900 font-semibold" >
                            Start Free Trial
                        </button>
					</div>
				</div>
			</div>
		</>
	)
}

export default page
