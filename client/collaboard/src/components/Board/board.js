import React, { useState, useEffect } from "react";
import CardContainer from "../CardContainer/cardContainer";
import { Container } from "react-smooth-dnd";
import { IoIosAdd } from "react-icons/io";
import sortBy from "lodash/sortBy";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import placementCalculation from "../../Utils/placementCalc";
import {
    AddSectionLinkIconSpan,
    AddSectionInput,
    ActiveAddSectionInput,
    SubmitCardButtonDiv,
    SubmitCardButton,
    SubmitCardIcon,
    BoardContainer,
    CardHorizontalContainer,
    AddSectionDiv,
    AddSectionForm,
    AddSectionLink,
    AddSectionLinkSpan,

} from "./styles";


const BOARD_QUERY = gql`
  query {
    fetchSections {
      id
      title
      label
      placement
      description
      cards {
        id
        title
        label
        description
        placement
      }
    }
  }
`;

const BOARD_SUBSCRIPTION = gql`
  subscription {
    segmentAdded {
      id
      title
      label
      description
      placement
      cards {
        id
        title
        label
        placement
        description
      }
    }
  }
`;

const ADD_SEGMENT = gql`
  mutation AddSegment($title: String!, $label: String!, $placement: Int!) {
    insertSegment(request: { title: $title, label: $label, placement: $placement }) {
      title
      description
      id
      label
    }
  }
`;


const UPDATE_SEGMENT_PLACEMENT = gql`
  mutation UpdateSegment($segmentId: String!, $placement: Int!) {
    updateSegmentPlacement(request: { segmentId: $segmentId, placement: $placement }) {
      id
      placement
    }
  }
`;

const ON_SEGMENT_PLACEMENT_CHANGE = gql`
  subscription {
    onSegmentPlacementChange {
      id
      placement
    }
  }
`;

const Board = () => {
    const [isAddSegmentInputActive, setAddSegmentInputActive] = useState(false);
  
    const [addSegmentInpuText, setAddSegmentInputText] = useState("");
    const [boards, setBoards] = useState([]);
    const [AddSegment, { insertSegment }] = useMutation(ADD_SEGMENT);
  
    const { loading, error, data } = useQuery(BOARD_QUERY);
  
    const [updateSegmentPlacement] = useMutation(UPDATE_SEGMENT_PLACEMENT);
  
    useEffect(() => {
      if (data) {
        setBoards(data.fetchSegments);
      }
    }, [data]);
  
    const { data: { segmentAdded } = {} } = useSubscription(BOARD_SUBSCRIPTION);
  
    const { data: { onSegmentPlacementChange } = {} } = useSubscription(
        ON_SEGMENT_PLACEMENT_CHANGE
    );
  
    useEffect(() => {
      if (onSegmentPlacementChange) {
         let newBoards = boards;
  
        newBoards = newBoards.map((board) => {
          if (board.id === onSegmentPlacementChange.id) {
            return { ...board, placement: onSegmentPlacementChange.placement };
          } else {
            return board;
          }
        });
        let sortedBoards = sortBy(newBoards, [
          (board) => {
            return board.placement;
          },
        ]);
         setBoards(sortedBoards);
      }
    }, [onSegmentPlacementChange]);
  
    useEffect(() => {
      if (segmentAdded) {
        setBoards(boards.concat(segmentAdded));
      }
    }, [segmentAdded]);
  
    const onColumnDrop = ({ removedIndex, addedIndex, payload }) => {
      if (data) {
        let updatePlacement = placementCalculation(
          removedIndex,
          addedIndex,
          data.fetchSegments
        );
        let newBoards = boards.map((board) => {
          if (board.id === payload.id) {
            return { ...board, placement: updatePlacement };
          } else {
            return board;
          }
        });
  
        let sortedBoards = sortBy(newBoards, [
          (board) => {
            return board.placement;
          },
        ]);
  
        updateSegmentPlacement({
          variables: {
            segmentId: payload.id,
            placement: parseInt(updatePlacement),
          },
        });
        setBoards([...sortedBoards]);
      }
    };
  
    const onAddSegmentSubmit = () => {
      if (addSegmentInpuText) {
        AddSegment({
          variables: {
            title: addSegmentInpuText,
            label: addSegmentInpuText,
            placement:
              boards && boards.length > 0
                ? boards[boards.length - 1].placement + 16384
                : 16384,
          },
        });
      }
    };
  
    return (
      <BoardContainer>
        <Container
          orientation={"horizontal"}
          onDrop={onColumnDrop}
          onDragStart={() => {
          }}
          getChildPayload={(index) => {
            return boards[index];
          }}
          dragHandleSelector=".column-drag-handle"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "cards-drop-preview",
          }}
        >
          {boards.length > 0 &&
            boards.map((item, index) => (
              <CardContainer item={item} key={index} boards={boards} />
            ))}
        </Container>
        <AddSectionDiv onClick={() => setAddSegmentInputActive(true)}>
          <AddSectionForm>
            {isAddSegmentInputActive ? (
              <React.Fragment>
                <ActiveAddSectionInput
                  onChange={(e) => setAddSegmentInputText(e.target.value)}
                />
                <SubmitCardButtonDiv>
                  <SubmitCardButton
                    type="button"
                    value="Add Card"
                    onClick={onAddSegmentSubmit}
                  />
                  <SubmitCardIcon>
                    <IoIosAdd />
                  </SubmitCardIcon>
                </SubmitCardButtonDiv>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <AddSectionLink href="#">
                  <AddSectionLinkSpan>
                    <IoIosAdd size={28} />
                    Add another list
                  </AddSectionLinkSpan>
                </AddSectionLink>
                <AddSectionInput />
              </React.Fragment>
            )}
          </AddSectionForm>
        </AddSectionDiv>
      </BoardContainer>
    );
  };
  
  export default Board;
