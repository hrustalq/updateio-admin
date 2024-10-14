import React, { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import $api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Обновленный компонент GameInfo
const GameInfo = ({
  game,
  onImageUpload,
}: {
  game: {
    id: string;
    name: string;
    image: string | null;
    version?: number | null;
  };
  onImageUpload: (file: File | null) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Информация об игре</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p>Версия: {game?.version || "Не указана"}</p>
      {game.image && (
        <img
          src={game.image}
          alt={game.name}
          className="w-32 h-32 object-cover rounded-md"
        />
      )}
      <FileUpload label="Изображение игры" onFileChange={onImageUpload} />
    </CardContent>
  </Card>
);

const formSchema = z.object({
  appIds: z.array(z.string()).min(1, "Выберите хотя бы одно приложение"),
});

type FormValues = z.infer<typeof formSchema>;

// Обновленный компонент ManageAppsDialog
const ManageAppsDialog = ({
  gameId,
  currentAppIds,
  onUpdateApps,
}: {
  gameId: string;
  currentAppIds: string[];
  onUpdateApps: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const { data: availableApps } = $api.useQuery("get", "/api/apps");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appIds: currentAppIds,
    },
  });

  useEffect(() => {
    form.reset({ appIds: currentAppIds });
  }, [currentAppIds, form]);

  const updateGameAppsMutation = $api.useMutation("patch", "/api/games/{id}");

  const handleSubmit = (values: FormValues) => {
    updateGameAppsMutation.mutate(
      {
        params: { path: { id: gameId } },
        body: { appIds: values.appIds },
      },
      {
        onSuccess: () => {
          setShowSuccessScreen(true);
          onUpdateApps();
        },
      },
    );
  };

  const handleClose = () => {
    form.reset();
    setShowSuccessScreen(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Управление приложениями
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showSuccessScreen
              ? "Приложения обновлены"
              : "Управление связанными приложениями"}
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {showSuccessScreen ? (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <CheckCircle className="text-green-500 w-16 h-16" />
              <p className="text-center text-lg font-semibold">
                Приложения успешно обновлены!
              </p>
              <Button onClick={handleClose}>Закрыть</Button>
            </motion.div>
          ) : (
            <motion.div
              key="app-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="appIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Выберите приложения
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {availableApps?.data?.map((app) => (
                              <div
                                key={app.id}
                                className="flex items-center p-2 bg-secondary rounded-md"
                              >
                                <input
                                  type="checkbox"
                                  id={app.id}
                                  value={app.id}
                                  checked={field.value.includes(app.id)}
                                  onChange={(e) => {
                                    const updatedValue = e.target.checked
                                      ? [...field.value, app.id]
                                      : field.value.filter(
                                          (id) => id !== app.id,
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                  className="mr-3 w-5 h-5"
                                />
                                <label
                                  htmlFor={app.id}
                                  className="flex items-center cursor-pointer flex-1"
                                >
                                  {app.image && (
                                    <img
                                      src={app.image}
                                      alt={app.name}
                                      className="w-8 h-8 object-cover rounded-full mr-3"
                                    />
                                  )}
                                  <span className="text-sm font-medium">
                                    {app.name}
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateGameAppsMutation.isPending}
                    >
                      {updateGameAppsMutation.isPending ? (
                        "Обновление..."
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Обновить
                        </>
                      )}
                    </Button>
                  </div>
                  {updateGameAppsMutation.isError && (
                    <p className="text-red-500 text-sm mt-2">
                      Ошибка: {(updateGameAppsMutation.error as Error).message}
                    </p>
                  )}
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

// Обновленный компонент LinkedApps
const LinkedApps = ({
  apps,
  gameId,
  onUpdateApps,
}: {
  apps?: { id: string; name: string; image: string | null }[];
  gameId: string;
  onUpdateApps: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Связанные приложения</span>
        <ManageAppsDialog
          gameId={gameId}
          currentAppIds={apps?.map((app) => app.id) || []}
          onUpdateApps={onUpdateApps}
        />
      </CardTitle>
    </CardHeader>
    <CardContent>
      {apps && apps.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center p-4 bg-secondary rounded-md"
            >
              {app.image ? (
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-16 h-16 object-cover rounded-full mb-2"
                />
              ) : (
                <div className="w-16 h-16 bg-primary rounded-full mb-2 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {app.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-center">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Нет связанных приложений
        </p>
      )}
    </CardContent>
  </Card>
);

// Обновленный компонент AppSettings
const AppSettings = ({
  gameId,
  app,
}: {
  gameId: string;
  app: { id: string; name: string; image: string | null };
}) => {
  const { data: settings, refetch } = $api.useQuery("get", "/api/settings", {
    params: { query: { appId: app.id, gameId } },
  });

  const [newSetting, setNewSetting] = React.useState({
    executorName: "",
    updateCommand: "",
  });

  const createSettingsMutation = $api.useMutation("post", "/api/settings");
  const updateSettingsMutation = $api.useMutation(
    "patch",
    "/api/settings/{id}",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSettingsMutation.mutate(
      {
        body: {
          executorName: newSetting.executorName,
          updateCommand: newSetting.updateCommand,
          gameId,
          appId: app.id,
        },
      },
      {
        onSuccess: () => {
          refetch();
          setNewSetting({ executorName: "", updateCommand: "" });
        },
      },
    );
  };

  const handleUpdate = (
    id: string,
    executorName: string,
    updateCommand: string,
  ) => {
    updateSettingsMutation.mutate(
      {
        params: { path: { id } },
        body: { executorName, updateCommand },
      },
      {
        onSuccess: () => refetch(),
      },
    );
  };

  return (
    <Card key={app.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          {app.image && (
            <img
              src={app.image}
              alt={app.name}
              className="w-8 h-8 object-cover rounded-full mr-2"
            />
          )}
          {app.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {settings?.data?.map((setting) => (
          <div key={setting.id} className="mb-4">
            <Input
              value={setting.executorName}
              disabled
              onChange={(e) =>
                handleUpdate(setting.id, e.target.value, setting.updateCommand)
              }
              className="mb-2"
              placeholder="Имя исполнителя"
            />
            <Input
              value={setting.updateCommand}
              disabled
              onChange={(e) =>
                handleUpdate(setting.id, setting.executorName, e.target.value)
              }
              className="mb-2"
              placeholder="Команда обновления"
            />
            <Separator className="my-2" />
          </div>
        ))}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="executorName">Имя исполнителя</Label>
            <Input
              id="executorName"
              value={newSetting.executorName}
              onChange={(e) =>
                setNewSetting({
                  ...newSetting,
                  executorName: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="updateCommand">Команда обновления</Label>
            <Input
              id="updateCommand"
              value={newSetting.updateCommand}
              onChange={(e) =>
                setNewSetting({
                  ...newSetting,
                  updateCommand: e.target.value,
                })
              }
            />
          </div>
          <Button type="submit">Добавить настройки</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export function GamePage() {
  const id = useParams({
    from: "/protected/games/$id",
    select: (params: { id: string }) => params.id,
  });

  const {
    data: game,
    isLoading,
    refetch: refetchGame,
  } = $api.useQuery("get", "/api/games/{id}", {
    params: { path: { id } },
  });

  const { data: apps, refetch: refetchApps } = $api.useQuery(
    "get",
    "/api/apps",
    {
      params: {
        query: {
          gameId: id,
        },
      },
    },
  );

  const updateGameImageMutation = $api.useMutation("patch", "/api/games/{id}");

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const image = await file.text();
      updateGameImageMutation.mutate(
        {
          params: { path: { id } },
          body: { image },
        },
        {
          onSuccess: () => refetchGame(),
        },
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!game) {
    return <div>Игра не найдена</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{game.name}</h1>
      <GameInfo game={game} onImageUpload={handleImageUpload} />
      <LinkedApps apps={apps?.data} gameId={id} onUpdateApps={refetchApps} />
      <div>
        <h2 className="text-2xl font-bold mb-4">Настройки приложений</h2>
        {apps?.data.map((app) => (
          <AppSettings key={app.id} gameId={id} app={app} />
        ))}
      </div>
    </div>
  );
}
