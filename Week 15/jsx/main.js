import { createElement } from "./framework.js";
import { Carousel } from "./Carousel.js";
import { Button } from "./Button.js";
import { List } from "./List.js";

let d = [
  {
    img:
      "https://static001.geekbang.org/resource/image/88/f1/8807661ef5b82fcb75e8b8f2dbd71ef1.jpg",
    url: "https://time.geekbang.org",
    title: "miao",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/67/00/67a1eac2683d27a798144e01a3097900.jpg",
    url: "https://time.geekbang.org",
    title: "miao",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/7a/30/7a9547384cffa039f063db1fc7669a30.jpg",
    url: "https://time.geekbang.org",
    title: "miao",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/82/af/823ef28a64096b4ffce19bca16a573af.jpg",
    url: "https://time.geekbang.org",
    title: "training4",
  },
];
/*
// document.body.appendChild(a);
let a = <Carousel src={d}
    onClick={event => window.location.href = event.detail.data.url}
    onChange={event => console.log(event.detail.position)}/> */

let a = <Button>content</Button>;
a.mountTo(document.body);

let b = (
  <List data={d}>
    {(record) => (
      <div>
        <img src={record.img} />
        <a href={record.url}>{record.title}</a>
      </div>
    )}
  </List>
);
b.mountTo(document.body);
