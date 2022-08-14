import { EmbedBuilder } from "discord.js";
import moment from "moment";
import "dotenv/config";
const {
    AUTHOR_MODIFIER,
    MODIFIED_AUTHOR_NAME = "",
    MODIFIED_AUTHOR_AVATAR,
} = process.env;
export const eventParser = (eventType: string, payload: any) => {
    switch (eventType) {
        case "push":
            return pushEvent(payload);
            break;
        default:
            break;
    }

    const embed = new EmbedBuilder()
        .setTitle(`Something went wrong`)
        .setThumbnail("https://upload.cc/i1/2022/08/14/SQ6UpE.png");
    return embed;
};

type Author = {
    name: string;
    login: string;
};

type Repository = {
    full_name: string;
};

type Commit = {
    message: string;
    author: Author;
    id: string;
    url: string;
};

type PushPayload = {
    ref: string;
    commits: Commit[];
    repository: Repository;
    sender: Sender;
    head_commit: HeadCommit;
};

type Sender = {
    login: string;
    avatar_url: string;
};

type HeadCommit = {
    id: string;
    message: string;
    timestamp: string;
};

const pushEvent = (payload: any) => {
    let description = "";
    const { ref, commits, repository, sender, head_commit } =
        payload as PushPayload;

    commits.forEach((commit) => {
        const { message, author, id, url } = commit;
        description += `**[${id.slice(0, 7)}](${url})** - ${message}\n`;
    });

    const embed = new EmbedBuilder()
        .setTitle(`${commits.length} 個新更新`)
        .setAuthor({
            name: AUTHOR_MODIFIER ? MODIFIED_AUTHOR_NAME : sender.login,
            iconURL: AUTHOR_MODIFIER
                ? MODIFIED_AUTHOR_AVATAR
                : sender.avatar_url,
        })
        .setColor(0x00ff99)
        .setDescription(description)
        .setThumbnail("https://upload.cc/i1/2022/08/14/SQ6UpE.png")
        .setFooter({
            text: `以上更新己自動部署到伺服器並在伺服器重啟之後生效，請注意伺服器重啟時間\n更新推送時間: ${moment()
                .utcOffset(480)
                .format("HH:mm:ss DD/MM/YYYY")}`,
            iconURL: "https://upload.cc/i1/2022/08/14/SQ6UpE.png",
        });

    return embed;
};
