import { Button } from "@/components/ui/button.tsx";
import { useAppStore } from "@/store/store.ts";
import { createCable } from "@anycable/web";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
	component: Index,
	beforeLoad: () => {
		const accessToken = useAppStore.getState().accessToken;
		if (!accessToken) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

function Index() {
	const [count, setCount] = useState(0);

	const cable = createCable("ws://localhost:8080/cable", {
		logLevel: "debug",
	});
	const signedName = "InRpbWVsaW5lL3B1YmxpYyI=--e0700d7670d753a8d1c0a1948ccc102d7ac94fc26c9e0b84b434d64222e3ca6a";
	const publicChannel = cable.streamFromSigned(signedName);

	publicChannel.on("message", (message) => {
		console.log("Received message:", message);
	});

	return (
		<>
			<h1>Vite + React</h1>
			<div className="card">
				<Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}
