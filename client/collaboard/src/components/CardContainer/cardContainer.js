import React, { useEffect, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { IoIosAdd } from "react-icons/io";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import sortBy from "lodash/sortBy";

import placementCalculation from "../../Utils/placementCalc";
import Card from "../Card/card";

import {
  CardsContainer,
  AddCardButtonDiv,
  AddCardButtonSpan,
  CardComposerDiv,
  ListCardComponent,
  ListCardDetails,
  ListCardTextArea,
  SubmitCardButtonDiv,
  SubmitCardButton,
  SubmitCardIcon,
  Wrapper,
  WrappedSection,
  CardContainerHeader,
  ContainerContainerTitle
} from './styles';

const ADD_CARD = gql`
  mutation InsertCard(
    $segmentId: ID!
    $title: String!
    $label: String!
    $placement: Int!
  ) {
    insertCard(
      request: {
        segmentId: $sectionId
        title: $title
        label: $label
        placement: $pos
      }
    ) {
      title
      label
      id
    }
  }
`;

const onCardAdded = gql`
  subscription {
    cardAdded {
      id
      title
      description
      segmentId
      placement
    }
  }
`;


const UPDATE_CARD = gql`
  mutation UpdateCard($cardId: String!, $placement: Int!, $segmentId: String!) {
    updateCardPlacement(
      request: { cardId: $cardId, placement: $placement, segmentId: $segmentId }
    ) {
      id
      title
      label
      placement
    }
  }
`;

const ON_CARD_UPDATE_SUBSCRIPTION = gql`
  subscription {
    onCardPlacementChange {
      id
      title
      label
      description
      placement
      segmentId
    }
  }
`;

const CardContainer = ({item, boards}) => {
  const [cards, setCards] = useState([]);
  const [isTempCard, setTempCard] = useState(false);
  const [cardText, setCardText]=useState("");
  const [insertCard, {data}] = useMutation(ADD_CARD);
  const [updateCardPlacement] = useMutation(UPDATE_CARD);
  const { data: { cardAdded } = {} } = useSubscription(onCardAdded);
  const { data: { onCardPlacementChange } = {} } = useSubscription(
    ON_CARD_UPDATE_SUBSCRIPTION
  );

  useEffect(() => {
    if (item && item.cards) {
      setCards(item.cards);
    }
  }, [item]);

  useEffect(() => {
    if (cardAdded) {
      if (item.id === cardAdded.segmentId) {
        setCards(item.cards.concat(cardAdded));

        setTempCardActive(false);
      }
    }
  }, [cardAdded]);

  const onCardDrop = (columnId, addedIndex, removedIndex, payload) => {
    let updatedPlacement;
    if (addedIndex !== null && removedIndex !== null) {
      let boardCards = boards.filter((p) => p.id === columnId)[0];

      updatedPlacement = placementCalculation(removedIndex, addedIndex, boardCards.cards);

      let newCards = cards.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            placement: updatedPlacement,
          };
        } else {
          return item;
        }
      });
      newCards = sortBy(newCards, (item) => item.placement);

      setCards(newCards);

      updateCardPlacement({
        variables: {
          cardId: payload.id,
          placement: parseInt(updatedPlacement),
          segmentId: columnId,
        },
      });
    } else if (addedIndex !== null) {
      const newColumn = boards.filter((p) => p.id === columnId)[0];

      if (addedIndex === 0) {
        updatedPlacement = newColumn.cards[0].pos / 2;
      } else if (addedIndex === newColumn.cards.length) {
        updatedPlacement = newColumn.cards[newColumn.cards.length - 1].placement + 16384;
      } else {
        let afterCardPlacement = newColumn.cards[addedIndex].placement;
        let beforeCardPlacement = newColumn.cards[addedIndex - 1].placement;

        updatedPlacement = (afterCardPlacement + beforeCardPlacement) / 2;
      }

      let newCards = cards.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            placement: updatedPlacement,
          };
        } else {
          return item;
        }
      });

      newCards = sortBy(newCards, (item) => item.pos);

      setCards(newCards);

      updateCardPos({
        variables: {
          cardId: payload.id,
          placement: parseInt(updatedPlacement),
          segmentId: columnId,
        },
      });
    }
  };

  const onAddButtonClick = () => {
    setTempCard(true);
  };

  const onAddCardSubmit = (e) => {
    e.preventDefault();
    if (cardText) {
       insertCard({
        variables: {
          segmentId: item.id,
          title: cardText,
          label: cardText,
          placement:
            cards && cards.length > 0
              ? cards[cards.length - 1].pos + 16348
              : 16348,
        },
      });

      setCardText("");
    };

    return (
      <Draggable key={item.id}>
        <Wrapper className={"card-container"}>
          <WrappedSection>
            <CardContainerHeader className={"column-drag-handle"}>
              <ContainerContainerTitle>{item.title}</ContainerContainerTitle>
            </CardContainerHeader>
            <CardsContainer>
              <Container
                orientation={"vertical"}
                groupName="col"
                onDrop={(e) => {
                  onCardDrop(item.id, e.addedIndex, e.removedIndex, e.payload);
                }}
                dragClass="card-ghost"
                dropClass="card-ghost-drop"
           
                getChildPayload={(index) => {
                  return cards[index];
                }}
              
                dropPlaceholder={{
                  animationDuration: 150,
                  showOnTop: true,
                  className: "drop-preview",
                }}
                dropPlaceholderAnimationDuration={200}
              >
                {cards.map((card) => (
                  <Card key={card.id} card={card} />
                ))}
              </Container>
              {isTempCard ? (
                <CardComposerDiv>
                  <ListCardComponent>
                    <ListCardDetails>
                      <ListCardTextArea
                        placeholder="Enter a title for the card"
                        onChange={(e) => {
                          setCardText(e.target.value);
                        }}
                      />
                    </ListCardDetails>
                  </ListCardComponent>
                  <SubmitCardButtonDiv>
                    <SubmitCardButton
                      type="button"
                      value="Add Card"
                      onClick={onAddCardSubmit}
                    />
                    <SubmitCardIcon>
                      <IoIosAdd />
                    </SubmitCardIcon>
                  </SubmitCardButtonDiv>
                </CardComposerDiv>
              ) : (
                <AddCardButtonDiv onClick={onAddButtonClick}>
                  <AddCardButtonSpan>Add another card</AddCardButtonSpan>
                </AddCardButtonDiv>
              )}
            </CardsContainer>
          </WrappedSection>
        </Wrapper>
      </Draggable>
    );
  };


};

export default CardContainer;


