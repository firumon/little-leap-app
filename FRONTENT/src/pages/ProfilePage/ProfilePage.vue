<template>
  <q-page padding class="flex flex-center bg-grey-1">
    <q-card class="profile-card shadow-12 q-pa-lg" style="width: 100%; max-width: 500px; border-radius: 16px;">
      <q-card-section class="text-center">
        <div class="relative-position inline-block">
          <q-avatar size="120px" class="shadow-5 q-mb-md">
            <img :src="profileData.avatar || 'https://cdn.quasar.dev/img/avatar.png'">
          </q-avatar>
          <q-btn
            round
            dense
            color="primary"
            icon="edit"
            class="absolute-bottom-right"
            @click="showAvatarDialog = true"
          />
        </div>
        
        <h1 class="text-h4 text-weight-bold q-mt-sm q-mb-xs">{{ profileData.name }}</h1>
        <q-chip color="primary" text-color="white" icon="verified_user" class="text-weight-medium">
          {{ profileData.role }}
        </q-chip>
      </q-card-section>

      <q-separator inset class="q-my-md" />

      <q-card-section class="q-gutter-y-md">
        <div class="row items-center q-gutter-x-md">
          <q-icon name="email" color="grey-7" size="sm" />
          <div>
            <div class="text-caption text-grey-7">Email Address</div>
            <div class="text-body1">{{ profileData.email }}</div>
          </div>
        </div>

        <div class="row items-center q-gutter-x-md">
          <q-icon name="badge" color="grey-7" size="sm" />
          <div>
            <div class="text-caption text-grey-7">User ID</div>
            <div class="text-body1">{{ profileData.id }}</div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mt-md">
        <q-btn flat color="grey-7" label="Go Back" @click="$router.back()" />
        <q-btn unelevated color="primary" label="Edit Profile" />
      </q-card-actions>
    </q-card>

    <!-- Update Avatar Dialog -->
    <q-dialog v-model="showAvatarDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 12px;">
        <q-card-section class="row items-center">
          <div class="text-h6">Update Avatar</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-caption text-grey-7">Please provide a direct URL to your new avatar image.</p>
          <q-input
            v-model="newAvatarUrl"
            label="Image URL"
            dense
            outlined
            autofocus
            @keyup.enter="updateAvatar"
          >
            <template v-slot:prepend>
              <q-icon name="link" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="primary" label="Update" @click="updateAvatar" :loading="updating" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const auth = useAuthStore()
const $q = useQuasar()

const profileData = computed(() => auth.userProfile || {
  name: 'Loading...',
  email: '...',
  id: '...',
  role: '...',
  avatar: ''
})

const showAvatarDialog = ref(false)
const newAvatarUrl = ref('')
const updating = ref(false)

async function updateAvatar() {
  if (!newAvatarUrl.value) return
  
  updating.value = true
  const result = await auth.updateAvatar(newAvatarUrl.value)
  updating.value = false
  
  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Avatar updated successfully',
      timeout: 2000
    })
    showAvatarDialog.value = false
    newAvatarUrl.value = ''
  } else {
    $q.notify({
      type: 'negative',
      message: result.message || 'Failed to update avatar'
    })
  }
}
</script>

<style scoped>
.profile-card {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
