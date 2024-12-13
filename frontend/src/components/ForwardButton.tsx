import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'

const ForwardButton = () => {
    const router = useRouter()

	return (
		<button onClick={() => router.back()}>
			<FaArrowLeft />
		</button>
	)
}

export default ForwardButton
