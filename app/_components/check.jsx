    <div className="flex flex-1 h-[75vh] border-b bg-white">
  {aiModelList.map((model, index) => (
    <div
      key={index}
      className={`flex flex-col border-r overflow-hidden ${
        model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"
      }`}
    >
      {/* 🔹 Header */}
      <div className="flex items-center justify-between border-b p-4 bg-white">
        <div className="flex items-center gap-3">
          <Image src={model.icon} alt={model.model} width={24} height={24} />
          {model.enable && (
            <Select
              defaultValue={aiSelectedModels[model.model].modelId}
              onValueChange={(v) => onSelectValue(model.model, v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={aiSelectedModels[model.model].modelId}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="px-3">
                  <SelectLabel className="text-sm text-gray-400">Free</SelectLabel>
                  {model.subModel
                    .filter((m) => !m.premium)
                    .map((m, i) => (
                      <SelectItem key={i} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
                <SelectGroup className="px-3">
                  <SelectLabel className="text-sm text-gray-400">Premium</SelectLabel>
                  {model.subModel
                    .filter((m) => m.premium)
                    .map((m, i) => (
                      <SelectItem key={i} value={m.name} disabled>
                        {m.name}
                        <Lock className="h-4 w-4 ml-2 text-gray-400" />
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          {model.enable ? (
            <Switch
              checked={model.enable}
              onCheckedChange={(v) => onToggleChange(model.model, v)}
            />
          ) : (
            <MessageSquare
              className="cursor-pointer h-5 w-5 text-gray-500"
              onClick={() => onToggleChange(model.model, true)}
            />
          )}
        </div>
      </div>

      {/* 🔹 Upgrade notice */}
      {model.premium && !has1 && model.enable && (
        <div className="flex items-center justify-center h-full">
          <Button>
            <Lock /> Upgrade to unlock
          </Button>
        </div>
      )}

      {/* 🔹 Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {messages[model.model]?.length ? (
          messages[model.model].map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap break-words p-3 rounded-lg shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="text-[10px] opacity-70 mb-1">
                    {m.model ?? model.model}
                  </div>
                )}
                {m.content === "loading" ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin w-4 h-4" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <h2>{m.content}</h2>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400 italic">
            No messages for {model.model}
          </div>
        )}
      </div>
    </div>
  ))}
</div>
