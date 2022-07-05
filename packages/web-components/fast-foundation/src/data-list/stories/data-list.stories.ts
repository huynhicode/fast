import { html, when } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTDataList as FoundationDataList } from "../data-list.js";

type DataListStoryArgs = Args & FoundationDataList;
type DataListStoryMeta = Meta<DataListStoryArgs>;

// create a sample data set
function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${i}`,
            title: `item #${i}`,
            url: `https://picsum.photos/200/200?random=${prefix * 1000 + i}`,
            itemSize: 100 + Math.floor(Math.random() * 300),
            itemCollapsedSize: 100,
        });
    }
    return newData;
}

const listItemTemplate = html`
    <fast-data-list-item
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index}"
        :idleLoad="${(x, c) => (c.parent.itemLoadMode === "idle" ? true : false)}"
        :itemContentsTemplate="${(x, c) => c.parent.itemContentsTemplate}"
    ></fast-data-list-item>
`;

const itemContentsTemplate = html`
    <fast-card>
        <div
            style="
                margin: 5px 20px 0 20px;
                color: white;
            "
        >
            ${x => x.itemData.title}
        </div>
        ${when(
            x => x.loadContent,
            html`
                <div
                    style="
                        height: 160px;
                        width:160px;
                        margin:10px 20px 10px 20px;
                        background-image: url('${x => x.itemData.url}');
                "
                ></div>
            `
        )}
        ${when(
            x => !x.loadContent,
            html`
                <div
                    style="
                    background: white;
                    opacity: 0.2;
                    height: 160px;
                    width:160px;
                    margin:10px 20px 10px 20px;
            "
                ></div>
            `
        )}
    </fast-card>
`;

const storyTemplate = html<DataListStoryArgs>`
    <fast-data-list
        :items="${newDataSet(100, 1)}"
        recycle="${x => x.recycle}"
        item-load-mode="${x => x.itemLoadMode}"
        idle-callback-timeout="${x => x.idleCallbackTimeout}"
        list-item-load-mode="${x => x.listItemLoadMode}"
        :itemTemplate="${listItemTemplate}"
        :itemContentsTemplate="${itemContentsTemplate}"
    ></fast-data-list>
`;

export default {
    title: "Data List",
    args: {
        itemSize: 100,
        idleLoadMode: "idle",
    },
    argTypes: {
        recycle: { control: { type: "boolean" } },
        itemLoadMode: {
            options: ["idle", "immediate"],
            control: { type: "select" },
        },
        idleCallbackTimeout: {
            control: { type: "text" },
        },
    },
} as DataListStoryMeta;

export const DataList = (args: DataListStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
