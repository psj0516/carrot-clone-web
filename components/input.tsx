import { InputHTMLAttributes } from "react";

interface InputProps {
	name: string;
	errors?: string[];
}

// input 이 받을 수 있는 모든 attributes를 받을 수 있게 한다
// Input 컴포넌트를 더 확장성 있고 커스텀 가능하게 만든다
export default function Input({
	name, // 필수 항목이므로 남긴다
	errors = [],
	...rest // name과 errors를 제외한 모든 props
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className="flex flex-col gap-2">
			<input
				name={name}
				className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
				{...rest}
			/>
			{errors.map((error, index) => (
				<span key={index} className="text-red-500 font-medium">
					{error}
				</span>
			))}
		</div>
	);
}