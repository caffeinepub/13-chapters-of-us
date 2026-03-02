import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";

actor {
  include MixinStorage();

  type PhotoEntry = {
    id : Text;
    blob : Storage.ExternalBlob;
    name : Text;
  };

  let photos = Map.empty<Text, PhotoEntry>();

  public shared ({ caller }) func uploadPhoto(id : Text, blob : Storage.ExternalBlob, name : Text) : async () {
    switch (photos.get(id)) {
      case (?_) { Runtime.trap("Photo with this id already exists") };
      case (null) {
        let photo : PhotoEntry = { id; blob; name };
        photos.add(id, photo);
      };
    };
  };

  public query ({ caller }) func getPhoto(id : Text) : async PhotoEntry {
    switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?photo) { photo };
    };
  };

  public query ({ caller }) func getAllPhotoIds() : async [Text] {
    photos.keys().toArray();
  };
};
