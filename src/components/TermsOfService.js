import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';
import HeaderOne from '../components/HeaderOne';
import ThemeStyle from '../const/ThemeStyle';

const TermsOfService = () => {
  return (
    <SafeAreaView style={[ThemeStyle.mainContainer]}>
      <View style={[ThemeStyle.mainContainer]}>
        <View style={[ThemeStyle.containerView]}>
          <HeaderOne pageName={'Terms of Service'} />
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>1.</Text>
              Basic Terms
            </Text>

            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>A.</Text> By using or
              visiting the Fitted Closet website (the “Site”), Fitted Closet
              mobile application(s) (the “Apps”) or any Fitted Closet products,
              software, data feeds, and services provided to you on or through
              the Fitted Closet website and mobile application (collectively the
              “Service(s)”) you are entering a legally binding agreement with
              Chute Laundry Inc. If you do not agree to any of these terms, you
              may not use the Service. Although we may attempt to notify you
              when major changes are made to these Terms of Service, you should
              periodically review the most up-to-date version
              (https://app.fittedcloset.com/terms-of-service/). Fitted Closet
              may, in its sole discretion, modify or revise these Terms of
              Service at any time, and, by continuing to use or visit the
              Service after updated Terms have been posted you agree to be bound
              by such modifications or revisions.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              Nothing in these Terms of Service shall be deemed to confer any
              third-party rights or benefits.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>B.</Text> You are
              responsible for your use of the Service, for any information,
              including personal information, you post to the Service, and for
              any consequences thereof. You may use the Service only if you are
              over eighteen (18) years of age and can form a binding contract
              with Fitted Closet or are using the Service under the direct
              direction of a parent or guardian that can accept these terms on
              your behalf. No user under thirteen (13) years of age may use the
              Service for any reason. You also affirm that you are not a person
              barred from receiving services under the laws of the United States
              or other applicable jurisdiction. If you are accepting these Terms
              and using the Service on behalf of a company, organization,
              government, or other legal entity, you represent and warrant that
              you are authorized to do so. If you are using the Service on
              behalf of a company or other legal entity, you are nevertheless
              individually bound by this Agreement even if your company has a
              separate agreement with us. You may use the Service only in
              compliance with these Terms and all applicable local, state,
              national, and international laws, rules and regulations.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>C.</Text> In order to
              access some features of the Service, you will have to create a
              Fitted Closet Account. You may never use another’s account. When
              creating your account, you must provide accurate and complete
              information. You are solely responsible for the activity that
              occurs on your account, and you must keep your account password
              secure. You must notify Fitted Closet immediately if any breach of
              security or unauthorized use of your account occurs. Although
              Fitted Closet will not be liable for your losses caused by any
              unauthorized use of your account, you may be liable for the losses
              of Fitted Closet or others due to such unauthorized use.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>D.</Text> You are
              responsible for safeguarding the password or credentials that you
              use to access the Service and for any activities or actions under
              your account. We encourage you to use “strong” passwords
              (passwords that use a combination of upper and lower case letters,
              numbers and symbols) with your account and with other accounts
              that you may connect to your Fitted Closet account. Fitted Closet
              cannot and will not be liable for any loss or damage arising from
              your failure to comply with the above requirements.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>E.</Text> The Service that
              Fitted Closet provides are always evolving and the form and nature
              of the Service may change from time to time without prior notice
              to you. In addition, Fitted Closet may stop (permanently or
              temporarily) providing the Service (or any features within the
              Service) to you or to users generally and may not be able to
              provide you with prior notice. We also retain the right to create
              limits on use and storage at our sole discretion at any time
              without prior notice to you.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>F.</Text> The Service may
              include advertisements, which may be targeted to the Content or
              information on the Service, queries made through the Service, or
              other information. The types and extent of advertising on the
              Service are subject to change. In consideration for Fitted Closet
              granting you access to and use of the Service, you agree that
              Fitted Closet and its parent, third party providers and partners
              may place such advertising on the Service or in connection with
              the display of Content or information from the Service whether
              submitted by you or others.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>G.</Text> These Terms of
              Service apply to all users of the Service, including users who are
              also contributors of Content on the Service. “Content” includes
              the text, software, scripts, graphics, photos, interactive
              features, and other materials you may view on, access through, or
              contribute to the Service. The Service includes all aspects of
              Fitted Closet.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>2.</Text> Privacy
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>A.</Text> Any information
              that you provide to Fitted Closet is subject to the Fitted Closet
              Privacy Policy, which governs our collection and use of your
              information. You understand that through your use of the Service
              you consent to the collection and use (as set forth in the Privacy
              Policy) of this information, including the transfer of this
              information to the United States and/or other countries for
              storage, processing and use by Fitted Closet. As part of providing
              you the Service, we may need to provide you with certain
              communications, such as service announcements and administrative
              messages. These communications are considered part of the Service
              and your Fitted Closet account, which you may not be able to
              opt-out from receiving.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>B.</Text> As a Fitted
              Closet account holder you may submit Content to the Service,
              including images, outfits, photos, and user comments. Please be
              aware that any Content you upload to publically accessible
              portions of the Service will be available to other registered
              users of the Service and may be accessible by members of the
              general public. Please only post Content that you are comfortable
              sharing and that you have the full right and authority to post in
              accordance with these terms.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>C.</Text> Fitted Closet
              stores your Content and other data in cloud based databases and
              analytical platforms. For more information, please see our Privacy
              Policy or contact us at hello@fittedcloset.com.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>3.</Text> Content on the
              Service
            </Text>
            <Text style={styles.paragraph}>
              All Content is the sole responsibility of the person who
              originated such Content. We may, but are not required to monitor
              or control the Content posted via the Service and we cannot take
              responsibility for such Content. Any use or reliance on any
              Content or materials posted via the Service or obtained by you
              through the Service is at your own risk. We do not endorse,
              support, represent or guarantee the completeness, truthfulness,
              accuracy, or reliability of any Content or communications posted
              via the Service or endorse any opinions expressed via the Service.
              You understand that by using the Service, you may be exposed to
              Content that might be offensive, harmful, inaccurate or otherwise
              inappropriate, or in some cases, postings that have been
              mislabeled or are otherwise deceptive. Under no circumstances will
              Fitted Closet be liable in any way for any Content, including, but
              not limited to, any errors or omissions in any Content, or any
              loss or damage of any kind incurred as a result of the use of any
              Content posted, emailed, transmitted or otherwise made available
              via the Service or broadcast elsewhere.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>4.</Text> Your Rights
            </Text>
            <Text style={styles.paragraph}>
              You retain your rights to any Content you submit or post or
              display on or through the Service. In order to make the Service
              available to you and other users, Fitted Closet needs a license
              from you. By submitting, posting or displaying Content on or
              through the Service, you grant us a worldwide, non-exclusive,
              royalty-free license (with the right to sublicense) to use, copy,
              reproduce, process, adapt, modify, publish, transmit, display and
              distribute such Content in any and all media or distribution
              methods (now known or later developed). You agree that this
              license includes the right for Fitted Closet to provide, promote,
              and improve the Service and to make Content submitted to or
              through the Service available to other companies, organizations or
              individuals who partner with Fitted Closet for the syndication,
              broadcast, distribution or publication of such Content on other
              media and services, subject to our terms and conditions for such
              Content use. Such additional uses by Fitted Closet, or other
              companies, organizations or individuals who partner with Fitted
              Closet, may be made with no compensation paid to you with respect
              to the Content that you submit, post, transmit or otherwise make
              available through the Service. We may modify or adapt your Content
              in order to transmit, display or distribute it over computer
              networks and in various media and/or make changes to your Content
              as are necessary to conform and adapt that Content to any
              requirements or limitations of any networks, devices, Service or
              media. You are responsible for your use of the Service, for any
              Content you provide, and for any consequences thereof, including
              the use of your Content by other users and our third party
              partners. Fitted Closet will not be responsible or liable for any
              use of your Content by Fitted Closet in accordance with these
              Terms. You represent and warrant that you have all the rights,
              power and authority necessary to grant the rights granted herein
              to any Content that you submit. You understand and agree, however,
              that Fitted Closet may retain, display, distribute or perform,
              server copies of your Content that have been removed or deleted.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>5.</Text> Fitted Closet’s
              Rights
            </Text>
            <Text style={styles.paragraph}>
              All right, title, and interest in and to the Service (excluding
              Content provided by users) are and will remain the exclusive
              property of Fitted Closet and its licensors. The Service are
              protected by copyright, trademark, and other laws of both the
              United States and foreign countries. Fitted Closet reserves all
              rights not expressly granted in these Terms. You acknowledge and
              agree that any feedback, comments, or suggestions you may provide
              regarding Fitted Closet, or the Service is entirely voluntary and
              we will be free to use such feedback, comments or suggestions as
              we see fit and without any obligation to you.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>6.</Text> Restrictions On
              Content And Use Of The Service
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>A.</Text> We reserve the
              right at all times (but will not have an obligation) to remove or
              refuse to distribute any Content on the Service and to suspend and
              or terminate users or reclaim usernames without liability to you.
              You shall be solely responsible for your own Content and the
              consequences of submitting and publishing your Content on the
              Service. You affirm, represent, and warrant that you own or have
              all the necessary licenses, rights, consents, and permissions to
              publish Content you submit; and you license to Fitted Closet all
              patent, trademark, trade secret, copyright or other proprietary
              rights in and to such Content for publication on the Service
              pursuant to these Terms of Service.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>B.</Text> You may NOT post
              Content that: Impersonates another person or entity in a manner
              that does or is intended to mislead, confuse, or deceive others;
              {'\n'}
              Violates the rights of a third party, including copyright,
              trademark, privacy, and publicity rights;{'\n'}
              Is a direct and specific threat of violence to others; {'\n'}
              Violates any applicable Community Guidelines;{'\n'}
              Violates any contractual obligation to refrain from photographing,
              filming or streaming any performance, event, film, concert,
              sporting event or other happening;{'\n'}
              Is furtherance of illegal activities; or{'\n'}
              Is harassing, abusive, promotes bullying, pornographic, or
              constitutes spam.{'\n'}
              Fitted Closet may remove Content that it determines, in its sole
              discretion, to violate this section.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              <Text style={ThemeStyle.FontWeight700}>C.</Text> You agree not to
              distribute in any medium any part of the Service or the Content
              without Fitted Closet’s prior written authorization, unless Fitted
              Closet makes available the means for such distribution through
              functionality offered by the Service (such as a link to embed on
              other social media platforms). You agree not to access Content
              through any technology means or means other than the content
              playback pages of the Service itself or other explicitly
              authorized means Fitted Closet may designate. You shall not
              download any Content unless you see or are provide a “download” or
              similar link displayed by Fitted Closet on the Service for that
              Content. You shall not copy, reproduce, distribute, transmit,
              broadcast, display, sell, license, or otherwise exploit any
              Content for any other purposes without the prior written consent
              of Fitted Closet or the respective licensors of the Content.
              Fitted Closet and its licensors reserve all rights not expressly
              granted in and to the Service and the Content.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              <Text style={ThemeStyle.FontWeight700}>D.</Text> We also reserve
              the right to access, read, preserve, and disclose any information
              as we reasonably believe is necessary to (i) satisfy any
              applicable law, regulation, legal process or governmental request,
              (ii) enforce the Terms, including investigation of potential
              violations hereof, (iii) detect, prevent, or otherwise address
              fraud, security or technical issues, (iv) respond to user support
              requests, or (v) protect the rights, property or safety of Fitted
              Closet, its users and the public. Fitted Closet does not disclose,
              sell, or otherwise make available any personally identifying
              information to third parties except in accordance with our Privacy
              Policy.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              <Text style={ThemeStyle.FontWeight700}>E.</Text> You may not do
              any of the following while accessing or using the Service: (i)
              access, tamper with, or use non-public areas of the Service,
              Fitted Closet's computer systems, or the technical delivery
              systems of Fitted Closet providers; (ii) probe, scan, or test the
              vulnerability of any system or network or breach or circumvent any
              security or authentication measures; (iii) access or search or
              attempt to access or search the Service by any means (automated or
              otherwise) other than through our currently available, published
              interfaces that are provided by Fitted Closet (and only pursuant
              to those terms and conditions), unless you have been specifically
              allowed to do so in a separate agreement with Fitted Closet (NOTE:
              scraping the Service without the prior consent of Fitted Closet is
              expressly prohibited); (iv) forge any TCP/IP packet header or any
              part of the header information in any email or posting, or in any
              way use the Service to send altered, deceptive or false
              source-identifying information; or (v) interfere with, or disrupt,
              (or attempt to do so), the access of any user, host or network,
              including, without limitation, sending a virus, overloading,
              flooding, spamming, mail-bombing the Service, or by scripting the
              creation of Content in such a manner as to interfere with or
              create an undue burden on the Service.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              <Text style={ThemeStyle.FontWeight700}>F.</Text> You agree not to
              use the Service for any of the following uses unless you obtain
              Fitted Closet’s prior written approval:{'\n'}
              the sale of access to the Service;{'\n'}
              the sale of advertising, sponsorships, or promotions placed on or
              within the Service or Content; or{'\n'}
              the sale of advertising, sponsorships, or promotions on any page
              of an ad-enabled blog, website or application containing Content
              delivered via the Service, unless other material not obtained from
              Fitted Closet appears on the same page and is sufficient of value
              to be the basis for such sales.{'\n'}
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              <Text style={ThemeStyle.FontWeight700}>G.</Text> Prohibited
              commercial uses do not include:{'\n'}
              Posting pictures to Fitted Closet, or maintaining an original
              profile on Fitted Closet, to promote yourself, your business or
              artistic enterprise;{'\n'}
              Sharing your outfits or profile from Fitted Closet through an
              embeddable link on an{'\n'}
              ad-enabled blog, website or application, subject to the
              advertising restrictions set forth in Section 4.0 of these Terms
              of Service; or{'\n'}
              any use Fitted Closet expressly authorizes in writing.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              <Text style={ThemeStyle.FontWeight700}>H.</Text> In your use of
              the Service, you will comply with all applicable laws.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>7.</Text> Digital
              Millennium Copyright Act
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>A.</Text> If you are a
              copyright owner on an authorized agent thereof and believe that
              any Content infringes upon your copyrights, you may submit a
              notification pursuant to the Digital Millennium Copyright Act
              (“DMCA”) by providing our Copyright Agent with the following
              information in writing (see § 17 U.S.C. 512(c)(3) for further
              detail):{'\n'}A physical or electronic signature of a person
              authorized to act on behalf of the owner of an exclusive right
              that allegedly infringed;{'\n'}
              Identification of the copyrighted work claimed to have been
              infringed, or, if multiple copyrighted works at a single online
              site are covered by a single notification, a representative list
              of such works at that site;{'\n'}
              Identification of the material that is claimed to be infringing or
              to be the subject of infringing activity and that is to be removed
              or access to which his to be disabled and information reasonably
              sufficient to permit the service provider to locate the material;
              Information reasonably sufficient to permit the service provider
              to contact you, such as an address, telephone number, and if
              available, an e-mail address;{'\n'}A statement that you have a
              good faith belief that the use of the material in the manner
              complained of is not authorized by the copyright owner, its agent,
              or the law; and{'\n'}A statement that the information in the
              notification is accurate, and under penalty of perjury, that you
              are authorized to act on behalf of the owner of an exclusive right
              that is allegedly infringed.{'\n'}
              You may direct copyright infringement notifications to Fitted
              Closet at 2261 MARKET ST NUM 4454 SAN FRANCISCO, CA 94114 or
              email: hello@fittedcloset.com. You acknowledge that if you fail to
              comply with all of the requirements of this Section, your DMCA
              notice may not be valid.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>B.</Text> Counter-Notice.
              If you believe that your Content that was removed (or to which
              access was disabled) is not infringing, or that you have the
              authorization from the copyright owner, the copyright owner’s
              agent, or pursuant to the law, to post and use the material in
              your Content, you may send a counter-notice containing the
              following information to the Copyright Agent:{'\n'}
              Your physical or electronic signature;{'\n'}
              Identification of the Content that has been removed or to which
              access has been disabled and the location at which the Content
              appeared before it was it was removed or disabled; A statement
              that you have a good faith belief that the Content was removed or
              disabled{'\n'}
              as a result of mistake or a misidentification of the Content; and
              {'\n'}
              Your name, address, telephone number, and e-mail address, a
              statement that you consent to the jurisdiction of the federal
              court in New York, NY, and a statement that you will accept
              service of process from the person who provided notification of
              the alleged infringement.{'\n'}
              If a counter-notice is received by the Copyright Agent, Fitted
              Closet may send a copy of the counter-notice to the original
              complaining party informing that person that it may replace the
              removed Content or cease disabling it in 10 business days. Unless
              the copyright owner files an action seeking a court order against
              the Content provider, member or user, the removed Content may be
              replaced, or access to it restored, in 10 to 14 business days or
              more after receipt of the counter-notice, at Fitted Closet’s sole
              discretion.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>8.</Text> Account
              Termination Policy
            </Text>
            <Text style={styles.paragraph}>
              The Terms will continue to apply until terminated by either you or
              Fitted Closet as follows. You may end your legal agreement with
              Fitted Closet at any time for any reason by deactivating your
              accounts and discontinuing your use of the Service. In order to
              deactivate your account and/or have your personal data deleted,
              please contact us at hello@fittedcloset.com. We may suspend or
              terminate your accounts or cease providing you with all or part of
              the Service at any time for any reason, including, but not limited
              to, if we reasonably believe: (i) you have violated these Terms,
              (ii) you create risk or possible legal exposure for us; or (iii)
              our provision of the Service to you is no longer commercially
              viable. We will make reasonable efforts to notify you by the email
              address associated with your account or through the Service the
              next time you attempt to access your account. In all such cases,
              the Terms shall terminate, including, without limitation, your
              license to use the Service, except those terms you would expect to
              survive termination of this Agreement. Nothing in this section
              shall affect Fitted Closet's rights to change, limit or stop the
              provision of the Service without prior notice, as provided above
              in section 1.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>9.</Text> Billing
            </Text>
            <Text style={styles.paragraph}>
              If you purchase products or Service directly from Fitted Closet,
              you authorize Fitted Closet to charge the applicable fees to you,
              including any ongoing charges for subscription renewals, through
              the designated payment method. You understand and acknowledge that
              Fitted Closet may adjust the pricing for its products and Service
              in the future and that you will be charged such adjusted fees on a
              going forward-basis after notice to you from Fitted Closet. If you
              purchase a subscription from Fitted Closet, your subscription will
              automatically renew at the end of each subscription term until you
              cancel the subscription. If you cancel a subscription, your
              subscription will terminate at the end of your current
              subscription period. You acknowledge that any payments you make to
              Fitted Closet are non-refundable. Fitted Closet may, at its
              discretion, provide you with a credit or refund, but such issuance
              of a credit or refund does not obligate Fitted Closet to provide
              you credits or refunds in the future. For in app purchases, Fitted
              Closet adheres to the refund policy from the digital store where
              the purchase was made.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>10.</Text> Warranty
              Disclaimed
            </Text>
            <Text style={styles.paragraph}>
              YOU AGREE THAT YOUR USE OF THE SERVICE SHALL BE AT YOUR SOLE RISK
              AND AGREE THAT THE SERVICE IS PROVIDED TO YOU ON AN “AS IS” AND
              “AS AVAILABLE” BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW,
              Fitted Closet, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS
              DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH
              THE SERVICE AND YOUR USE THEREOF. Fitted Closet MAKES NO
              WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS
              OF THIS SITE'S CONTENT OR THE CONTENT OF ANY SITES LINKED TO THIS
              SITE AND ASSUMES NO LIABILITY OR RESPONSIBILITY FOR ANY (I)
              ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY
              OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR
              ACCESS TO AND USE OF OUR SERVICE, (III) ANY UNAUTHORIZED ACCESS TO
              OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL
              INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (IV) ANY
              INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR SERVICE,
              (IV) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE
              TRANSMITTED TO OR THROUGH OUR SERVICE BY ANY THIRD PARTY, AND/OR
              (V) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR
              DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT
              POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE
              SERVICE. Fitted Closet DOES NOT WARRANT, ENDORSE, GUARANTEE, OR
              ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR
              OFFERED BY A THIRD PARTY THROUGH THE SERVICE OR ANY HYPERLINKED
              SERVICE OR FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND Fitted
              Closet WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR
              MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS
              OF PRODUCTS OR SERVICE. AS WITH THE PURCHASE OF A PRODUCT OR
              SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE
              YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>11.</Text> Limitation of
              Liability
            </Text>
            <Text style={styles.paragraph}>
              IN NO EVENT SHALL Fitted Closet, ITS OFFICERS, DIRECTORS,
              EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT,
              INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER
              RESULTING FROM ANY
              {'\n'}(I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT,{'\n'} (II)
              PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER,
              RESULTING FROM YOUR ACCESS TO AND USE OF OUR SERVICE, {'\n'}(III)
              ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY
              AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED
              THEREIN, {'\n'}(IV) ANY INTERRUPTION OR CESSATION OF TRANSMISSION
              TO OR FROM OUR SERVICE,
              {'\n'}(IV) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE, WHICH
              MAY BE TRANSMITTED TO OR THROUGH OUR SERVICE BY ANY THIRD PARTY,
              AND/OR
              {'\n'}(V) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS
              OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF YOUR USE OF ANY
              CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE
              VIA THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY
              OTHER LEGAL THEORY, AND WHETHER OR NOT THE COMPANY IS ADVISED OF
              THE POSSIBILITY OF SUCH DAMAGES. THE FOREGOING LIMITATION OF
              LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW IN
              THE APPLICABLE
              {'\n'}
              JURISDICTION.{'\n'}
              YOU SPECIFICALLY ACKNOWLEDGE THAT Fitted Closet SHALL NOT BE
              LIABLE FOR CONTENT OR THE DEFAMATORY, OFFENSIVE, OR ILLEGAL
              CONDUCT OF ANY THIRD PARTY AND THAT THE RISK OF HARM OR DAMAGE
              FROM THE FOREGOING RESTS ENTIRELY WITH YOU.
              {'\n'} YOU AND Fitted Closet AGREE THAT ANY CAUSE OF ACTION
              ARISING OUT OF OR RELATED TO THE SERVICE MUST COMMENCE WITHIN ONE
              (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE
              OF ACTION IS PERMANENTLY BARRED.
              {'\n'}
              The Service is controlled and offered by Fitted Closet from its
              facilities in the United States of America. Fitted Closet makes no
              representations that the Service is appropriate or available for
              use in other locations. Those who access or use the Service from
              other jurisdictions do so at their own volition and are
              responsible for compliance with local law.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>12.</Text> Links and Third
              Party Websites
            </Text>
            <Text style={styles.paragraph}>
              The Service may contain links to third-party websites or
              resources. Please be aware that if you upload, link or share any
              Content created on the Service to any third party website or
              services, including without limitation to Instagram, Snapchat,
              Facebook, or Pinterest your Content will be subject to the privacy
              policies terms and conditions of those websites and mobile apps,
              which may have different rights, rules and policies than provided
              herein. You acknowledge and agree that we are not responsible or
              liable for: (i) the availability or accuracy of such websites or
              resources; or (ii) the content, products, or services on or
              available from such websites or resources. Links to such websites
              or resources do not imply any endorsement by Fitted Closet
              Entities of such websites or resources or the content, products,
              or services available from such websites or resources. You
              acknowledge sole responsibility for and assume all risk arising
              from your use of any such websites or resources. Please review all
              applicable terms and policies before uploading your Content to any
              third party website.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>13.</Text> Indemnity
            </Text>
            <Text style={styles.paragraph}>
              To the extent permitted by applicable law, you agree to defend,
              indemnify, and hold harmless Fitted Closet, its parent
              corporation, officers, directors, employees and agents, from and
              against any and all claims, damages, obligations, losses,
              liabilities, costs or debts, and expenses (including but not
              limited to attorney’s fees) arising from: (i) your use of and
              access to the Service; (ii) your violation of any term of these
              Terms of Service; (iii) your violation of any third party right,
              including without limitation any copyright, property, or privacy
              right; or (iv) any claim that your Content caused damage to a
              third party. This defense and indemnification obligation will
              survive these Terms of Service and your use of the Service.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>14.</Text> Assignment
            </Text>
            <Text style={styles.paragraph}>
              These Terms of Service, and any rights and licenses granted
              hereunder, may not be transferred or assigned by you, but may be
              assigned by Fitted Closet without restriction.
            </Text>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              <Text style={ThemeStyle.FontWeight700}>15.</Text>General Terms:
              Waiver and Severability
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>A.</Text> Waiver{'\n'}
              No waiver of any term of this these Terms of Service shall be
              deemed a further or continuing waiver of such term or any other
              term, and Fitted Closet's failure to assert any right or provision
              under these Terms of Service shall not constitute a waiver of such
              right or provision.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>B.</Text> Controlling Law
              and Jurisdiction{'\n'}
              These Terms and any action related thereto will be governed by the
              laws of the State of Ohio without regard to or application of its
              conflict of law provisions or your state or country of residence.
              All claims, legal proceedings or litigation arising in connection
              with the Service will be brought solely in the federal or state
              courts located in Hamilton County, Ohio, United States, and you
              consent to the jurisdiction of and venue in such courts and waive
              any objection as to inconvenient forum. If you are a federal,
              state, or local government entity in the United States using the
              Service in your official capacity and legally unable to accept the
              controlling law, jurisdiction or venue clauses above, then those
              clauses do not apply to you. For such U.S. federal government
              entities, these Terms and any action related thereto will be
              governed by the laws of the United States of America (without
              reference to conflict of laws) and, in the absence of federal law
              and to the extent permitted under federal law, the laws of the
              State of Ohio (excluding choice of law).
              {'\n'}You agree that: (i) the Service shall be deemed solely based
              in Ohio; and (ii) the Service shall be deemed a passive website
              that does not give rise to personal jurisdiction over Fitted
              Closet, either specific or general, in jurisdictions other than
              Ohio.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>C.</Text> Entire Agreement
              and Severability{'\n'}
              These Terms of Service, together with the Privacy Notice at
              https://www.app.fittedcloset.com/privacy as applicable, the Fitted
              Closet Licensing Agreement, and any other legal notices published
              by Fitted Closet on the Service, shall constitute the entire
              agreement between you and Fitted Closet concerning the Service. If
              any provision of these Terms of Service is deemed invalid by a
              court of competent jurisdiction, the invalidity of such provision
              shall not affect the validity of the remaining provisions of these
              Terms of Service, which shall remain in full force and effect.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>D.</Text> Changes to the
              Agreement
              {'\n'}
              We may revise these Terms from time to time, the most current
              version will always be at
              https://app.fittedcloset.com/terms-of-service/. If the revision,
              in our sole discretion, is material we will notify you via email
              to the email associated with your account or through the Service.
              If you do not wish to be bound by any such revisions to the Terms,
              you must end these Terms with us as set forth above. By continuing
              to access or use the Service after those revisions become
              effective, you agree to be bound by the revised Terms.
            </Text>
            <Text style={styles.paragraph}>
              These Service are operated and provided by Chute Laundry Inc.
              located at 2261 MARKET ST NUM 4454 SAN FRANCISCO, CA 94114. If you
              have any questions about these Terms, please contact us.
            </Text>
            <Text style={styles.paragraph}>Effective: January 26th, 2024</Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TermsOfService;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
});
