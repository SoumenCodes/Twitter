<template>
  <q-page class="relative-positionx">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-pa-lg q-mx-lg row items-end q-col-gotter-lg">
        <div class="col">
          <q-input
            bottom-slots
            v-model="qweetText"
            label="Whats Happening ?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="lg">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar>
            </template>

            <template v-slot:hint> Field hint </template>

            <template v-slot:after> </template>
          </q-input>
        </div>
        <div class="col col-shrink items-end">
          <q-btn
            class="q-mb-lg"
            round
            dense
            flat
            icon="send"
            @click="newQweet"
          />
        </div>
      </div>
      <q-separator class="divider" color="grey-2" size="10px" />
      <div class="q-my-lg column items-center bg-indigo-10">
        <q-item
          v-for="qweet in qweetArray"
          :key="qweet.id"
          clickable
          v-ripple
          class="q-my-md shadow-4 bg-white"
          style="width: 500px"
        >
          <q-item-section avatar top>
            <q-avatar size="lg">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1">
              <strong>Danny Connell</strong>
              <span class="text-grey-7">
                @danny__connell &bull; {{ qweetDate(qweet.date) }}</span
              >
              <p>
                {{ qweet.content }}
              </p>
            </q-item-label>

            <div class="row justify-between q-gutter-sm">
              <q-btn
                flat
                round
                color="black "
                icon="far fa-comment"
                size="sm"
              />
              <q-btn
                @click="likeUpdate(qweet)"
                flat
                round
                color="primary "
                :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                size="sm"
              />
              <q-btn
                flat
                round
                color="black "
                icon="fas fa-retweet"
                size="sm"
              />
              <q-btn
                size="sm"
                flat
                round
                color="black "
                icon="fas fa-trash"
                @click="deleteQweet(qweet)"
              />
            </div>
            <q-separator />
          </q-item-section>
        </q-item>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from "src/boot/firebase";
import { defineComponent, ref, computed, onMounted } from "vue";
import { formatDistance, subDays } from "date-fns";
export default defineComponent({
  name: "HomePage",
  setup() {
    const qweetText = ref("");
    const QweetData = ref();
    let DeleteIndex;
    const qweetArray = ref([
      // {
      //   id: "hd",
      //   liked: true,
      //   content:
      //     " Lorem ipsum, dolor sit amet conur dolor sit a amet consectetur dolor sit amet consectetur  ",
      //   date: 1692385873075,
      // },
      // {
      //   id: "hsd",
      //   liked: false,
      //   content:
      //     "iure quas veritatis expedita ab  sit amamet consectetur dolor sit amet consectetur dolor sit amet consdolor sit amet consectetur dolor sit amet consectetur  ",
      //   date: 1692097065265,
      // },
    ]);

    const qweetArrayComputed = computed({
      get() {
        return qweetArray.value;
      },
      set() {
        return qweetArray.value;
      },
    });

    function deleteQweet(qweet) {
      db.collection("qweet")
        .doc(qweet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
    function likeUpdate(qweet) {
      console.log(qweet, "up");
      db.collection("qweet")
        .doc(qweet.id)
        .update({
          liked: !qweet.liked,
        })
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }

    function newQweet() {
      if (qweetText.value) {
        QweetData.value = {
          content: qweetText.value,
          date: Date.now(),
          liked: false,
        };
        // Add a new document in collection "Qweet"
        db.collection("qweet")
          .add(QweetData.value)
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
        qweetText.value = "";
      }
    }

    function qweetDate(date) {
      return formatDistance(date, new Date());
    }

    onMounted(() => {
      db.collection("qweet")
        .orderBy("date")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            let qweetChange = change.doc.data();
            qweetChange.id = change.doc.id;
            if (change.type === "added") {
              console.log("New qweet: ", qweetChange);
              qweetArray.value.push(qweetChange);
            }
            if (change.type === "modified") {
              console.log("Modified qweet: ", qweetChange);
              DeleteIndex = qweetArray.value.findIndex(
                (kch) => kch.id === qweetChange.id
              );
              Object.assign(qweetArray.value[DeleteIndex], qweetChange);
            }
            if (change.type === "removed") {
              console.log("Removed qweet: ", qweetChange);
              DeleteIndex = qweetArray.value.findIndex(
                (kch) => kch.id === qweetChange.id
              );
              qweetArray.value.splice(DeleteIndex, 1);
            }
          });
        });
    });

    return {
      qweetDate,
      qweetText,
      qweetArray,
      newQweet,
      deleteQweet,
      qweetArrayComputed,
      QweetData,
      likeUpdate,
    };
  },
});
</script>
