import React from "react"
import ChatTextArea from "@/components/chat/ChatTextArea"
import QuotedMessagePreview from "@/components/chat/QuotedMessagePreview"
import { ChatState, MessageHandlers, ScrollBehavior } from "../../types/chatTypes"

interface InputSectionProps {
	chatState: ChatState
	messageHandlers: MessageHandlers
	scrollBehavior: ScrollBehavior
	placeholderText: string
	shouldDisableFilesAndImages: boolean
	selectFilesAndImages: () => Promise<void>
}

/**
 * Input section including quoted message preview and chat text area
 */
export const InputSection: React.FC<InputSectionProps> = ({
	chatState,
	messageHandlers,
	scrollBehavior,
	placeholderText,
	shouldDisableFilesAndImages,
	selectFilesAndImages,
}) => {
	const {
		activeQuote,
		setActiveQuote,
		isTextAreaFocused,
		inputValue,
		setInputValue,
		sendingDisabled,
		selectedImages,
		setSelectedImages,
		selectedFiles,
		setSelectedFiles,
		textAreaRef,
		handleFocusChange,
		queuedMessages,
	} = chatState

	const { isAtBottom, scrollToBottomAuto } = scrollBehavior

	// Handle send or queue based on sending state
	const handleSendOrQueue = () => {
		if (sendingDisabled) {
			// Add to queue when AI is active
			messageHandlers.addToQueue(inputValue, selectedImages, selectedFiles)
			// Clear input immediately to give feedback that message was queued
			setInputValue("")
			setSelectedImages([])
			setSelectedFiles([])
		} else {
			// Send normally when AI is available
			messageHandlers.handleSendMessage(inputValue, selectedImages, selectedFiles)
		}
	}

	return (
		<>
			{activeQuote && (
				<div style={{ marginBottom: "-12px", marginTop: "10px" }}>
					<QuotedMessagePreview
						isFocused={isTextAreaFocused}
						onDismiss={() => setActiveQuote(null)}
						text={activeQuote}
					/>
				</div>
			)}

			{queuedMessages.length > 0 && (
				<div
					style={{
						marginBottom: "-8px",
						marginTop: "5px",
						padding: "4px 8px",
						backgroundColor: "var(--vscode-statusBar-debuggingBackground)",
						color: "var(--vscode-statusBar-debuggingForeground)",
						borderRadius: "4px",
						fontSize: "12px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}>
					<span>
						📬 {queuedMessages.length} message{queuedMessages.length === 1 ? "" : "s"} queued
					</span>
					{messageHandlers.clearQueue && (
						<button
							onClick={messageHandlers.clearQueue}
							style={{
								background: "none",
								border: "none",
								color: "inherit",
								cursor: "pointer",
								fontSize: "12px",
								padding: "2px 4px",
								borderRadius: "2px",
							}}
							title="Clear queue">
							✕
						</button>
					)}
				</div>
			)}

			<ChatTextArea
				activeQuote={activeQuote}
				inputValue={inputValue}
				onFocusChange={handleFocusChange}
				onHeightChange={() => {
					if (isAtBottom) {
						scrollToBottomAuto()
					}
				}}
				onSelectFilesAndImages={selectFilesAndImages}
				onSend={handleSendOrQueue}
				placeholderText={placeholderText}
				ref={textAreaRef}
				selectedFiles={selectedFiles}
				selectedImages={selectedImages}
				sendingDisabled={sendingDisabled}
				setInputValue={setInputValue}
				setSelectedFiles={setSelectedFiles}
				setSelectedImages={setSelectedImages}
				shouldDisableFilesAndImages={shouldDisableFilesAndImages}
				queuedMessagesCount={queuedMessages.length}
				clearQueue={messageHandlers.clearQueue}
			/>
		</>
	)
}
