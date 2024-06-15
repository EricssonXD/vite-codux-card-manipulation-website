import { useRef, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Container } from "semantic-ui-react";



const Actor = ({ member, setDraggedItem }) => {
  const [dragging, setDragging] = useState(false);

  function startDrag() {
    setDragging(true);
    setDraggedItem(member);
  }

  function endDrag() {
    setDragging(false);
    setTimeout(() => {
      setDraggedItem("");
    }, 0);
    //this setTimeout is important it allows the the current dragged
    //item state to be written to the drop target array before the dragged item is reset
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, bottom: 0, top: 0 }}
      dragElastic={1}
      dragTransition={{ bounceStiffness: 0 }}
      //need the drag constraints, elastic, and transition in order for things to work right
      //try commenting them out and see how it works
      onDragStart={startDrag}
      onDragEnd={endDrag}
    // dragging={dragging}
    //this is the boolean that gets passed to the styled component to remove the pointerEvents
    //not sure why console throws an error for this
    >
      {member}
    </motion.div>
  );
};

function TestCard() {
  const [team1, setTeam1] = useState(["1", "2", "3", "4", "5"]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState("");

  function handleDrop(team) {
    console.log(team)
    if (draggedItem.length > 0) {
      if (team === "team2") {
        setTeam2([...team2, draggedItem]);
        let copy = JSON.parse(JSON.stringify(team1));
        setTeam1(copy.filter((member) => member !== draggedItem));
      } else if (team === "team1") {
        setTeam1([...team1, draggedItem]);
        let copy = JSON.parse(JSON.stringify(team2));
        setTeam2(copy.filter((member) => member !== draggedItem));
      }
    }
  }

  return (
    <div className='App'>
      <Container onMouseUpCapture={() => handleDrop("team1")}>
        {team1.map((member, i) => (
          <Actor key={i} setDraggedItem={setDraggedItem} member={member} />
        ))}
      </Container>

      <Container onMouseUpCapture={() => handleDrop("team2")}>
        {team2.map((member, i) => (
          <Actor key={i} setDraggedItem={setDraggedItem} member={member} />
        ))}
      </Container>
    </div>
  );
}

export default TestCard;
