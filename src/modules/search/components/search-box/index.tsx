import { XMarkMini } from "@medusajs/icons"
import { FormEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import SearchBoxWrapper, {
  ControlledSearchBoxProps,
} from "../search-box-wrapper"
import { analytics } from "@lib/context/segment"

const ControlledSearchBox = ({
  inputRef,
  onChange,
  onReset,
  onSubmit,
  placeholder,
  value,
  ...props
}: ControlledSearchBoxProps) => {
  const router = useRouter()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastTrackedQuery = useRef<string>("")

  useEffect(() => {
    if (!value || value.length < 3) return

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      if (value !== lastTrackedQuery.current) {
        analytics.track("Search Query Updated", {
          query: value,
        })
        lastTrackedQuery.current = value
      }
    }, 1000)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [value])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (onSubmit) {
      onSubmit(event)
    }

    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleReset = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    onReset(event)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleOutsideClick = () => {
    router.back()
  }

  const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (inputRef.current?.value) {
        analytics.track("Search Submitted", {
          query: inputRef.current.value,
        })
      }
      router.push(
        `/results/${
          inputRef.current?.value
            ? encodeURIComponent(inputRef.current.value)
            : ""
        }`
      )
    }
  }

  return (
    <div {...props} className="w-full">
      <form action="" noValidate onSubmit={handleSubmit} onReset={handleReset}>
        <div className="flex items-center justify-between">
          <input
            ref={inputRef}
            data-testid="search-input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={placeholder}
            spellCheck={false}
            type="search"
            value={value}
            onChange={onChange}
            onKeyDown={keyDown}
            className="txt-compact-large h-6 placeholder:text-ui-fg-on-color placeholder:transition-colors focus:outline-none flex-1 bg-transparent "
            style={{
              fontSize: "16px",
            }}
          />
          {value && <button type="submit">Search</button>}
          {value && (
            <button
              onClick={handleReset}
              type="button"
              className="items-center justify-center text-ui-fg-on-color focus:outline-none gap-x-2 px-2 txt-compact-large flex"
            >
              <XMarkMini />
            </button>
          )}
          <button onClick={handleOutsideClick}> Close</button>
        </div>
      </form>
    </div>
  )
}

const SearchBox = () => {
  const router = useRouter()

  return (
    <SearchBoxWrapper>
      {(props) => {
        return (
          <>
            <ControlledSearchBox {...props} />
          </>
        )
      }}
    </SearchBoxWrapper>
  )
}

export default SearchBox
