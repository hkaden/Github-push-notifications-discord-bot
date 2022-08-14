import { Collection } from "mongodb";

type Record = {
    uuid: string;
    channleId: string;
};

export const add = async (
    uuid: string,
    channelId: string,
    subscriptions: Collection
): Promise<boolean> => {
    const isExist = await subscriptions.findOne({ channelId });
    if (isExist) {
        return false;
    }
    await subscriptions.insertOne({ uuid, channelId });
    return true;
};

export const remove = async (
    uuid: string,
    subscriptions: Collection
): Promise<void> => {
    await subscriptions.deleteOne({ uuid });
}